import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";
import PendingUser from "../models/pendingUser.js";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const makeVerifyToken = ({ email, purpose }) => {
  const payload = {
    purpose,
    email,
  };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "10m",
  });
};

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // 1️⃣ Check if user already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2️⃣ Check for existing pending user
    const existingPending = await PendingUser.findOne({ email });
    if (existingPending) {
      if (existingPending.expiresAt > new Date()) {
        return res.status(400).json({
          message:
            "A verification link was already sent. Please check your email.",
        });
      } else {
        await PendingUser.deleteOne({ email }); // cleanup expired
      }
    }

    // 3️⃣ Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4️⃣ Create verification token (DO NOT put password inside)
    const verificationToken = makeVerifyToken({
      email,
      purpose: "email-verify",
    });

    // 5️⃣ Save pending user
    const pendingUser = await PendingUser.create({
      fullName,
      email,
      password: passwordHash,
      verificationToken,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
    });

    // 6️⃣ Send email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (err) {
      console.error("Email sending failed:", err);
      await PendingUser.deleteOne({ _id: pendingUser._id }); // rollback
      return res
        .status(500)
        .json({ message: "Failed to send email. Try again." });
    }

    return res.status(200).json({
      message:
        "Check your email to verify your account. The link expires in 10 minutes.",
    });
  } catch (err) {
    console.error("SignUp Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User doesn't exist!" });

    if (!user.verified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, fullName: user.fullName },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send JWT as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV, // only over HTTPS in prod
      sameSite: "strict", // protect against CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        roles: user.roles,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.body;

  try {
    // 1️⃣ Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.purpose !== "email-verify") {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    // 2️⃣ Check if user already exists
    let user = await User.findOne({ email: decoded.email });
    if (user) {
      if (!user.verified) {
        user.verified = true;
        await user.save();
      }
      // delete any leftover pending doc
      await PendingUser.deleteOne({ email: decoded.email });

      return res.status(200).json({
        message: "Email already verified",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          roles: user.roles,
          verified: user.verified,
        },
      });
    }

    // 3️⃣ Otherwise, check pending user
    const pendingUser = await PendingUser.findOne({
      email: decoded.email,
      verificationToken: token,
      expiresAt: { $gt: new Date() }, // ensure not expired
    });

    if (!pendingUser) {
      console.log("❌ No pending user found (maybe already verified)");
      return res
        .status(400)
        .json({ message: "Verification link expired or invalid" });
    }

    console.log("✅ Pending user found:", pendingUser.email);

    // 4️⃣ Create real user
    try {
      user = await User.create({
        fullName: pendingUser.fullName,
        email: pendingUser.email,
        password: pendingUser.password,
        verified: true,
      });
    } catch (error) {
      if (error.code === 11000) {
        // If race condition → fetch existing
        user = await User.findOneAndUpdate(
          { email: pendingUser.email },
          { verified: true },
          { new: true }
        );
      } else {
        throw error;
      }
    }

    // 5️⃣ Delete pending user
    await PendingUser.deleteOne({ email: pendingUser.email });

    // 6️⃣ Auto-login (set cookie)
    const loginToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", loginToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Email verified and logged in",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        roles: user.roles,
        verified: user.verified,
      },
    });
  } catch (err) {
    console.error("Verify Email Error:", err);
    return res.status(400).json({ message: "Verification failed or expired" });
  }
};

export const logOut = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV,
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const cookieMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // no password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

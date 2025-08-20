import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";
import PendingUser from "../models/pendingUser.js";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const makeVerifyToken = ({ fullName, email, passwordHash }) => {
  const payload = {
    purpose: "email-verify",
    email,
    fullName,
    passwordHash, // bcrypt hash only
  };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "10m",
  });
};

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user exists
    if (await User.findOne({ email: email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check pending user
    const existingPending = await PendingUser.findOne({ email: email });
    if (existingPending) {
      if (existingPending.expiresAt > new Date()) {
        return res.status(400).json({
          message:
            "A verification link was already sent. Please check your email.",
        });
      } else {
        await PendingUser.deleteOne({ email: email }); // remove expired
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create token & save pending user
    const verificationToken = makeVerifyToken({
      fullName,
      email,
      passwordHash,
    });

    await PendingUser.create({
      fullName,
      email,
      password: passwordHash,
      verificationToken,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendVerificationEmail(email, verificationToken);

    return res.status(200).json({
      message:
        "Check your email to verify your account. The link expires in 10 minutes.",
    });
  } catch (err) {
    console.error(err);
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
    // 1️⃣ Verify JWT first (fail fast)
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.purpose !== "email-verify") {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    // 2️⃣ Find pending user
    const pendingUser = await PendingUser.findOne({
      email: decoded.email,
      verificationToken: token,
    });

    if (!pendingUser) {
      return res.status(400).json({ message: "Link expired or invalid" });
    }

    // 3️⃣ Check if already in User collection
    const existingUser = await User.findOne({ email: decoded.email });
    if (existingUser) {
      // Already verified — clean up pendingUser if it exists
      await PendingUser.deleteOne({ email: decoded.email });
      return res.status(200).json({
        message: "Email already verified",
        user: {
          id: existingUser._id,
          fullName: existingUser.fullName,
          email: existingUser.email,
          roles: existingUser.roles,
          verified: existingUser.verified,
        },
      });
    }

    const userData = pendingUser;

    // 5️⃣ Delete pending user
    await PendingUser.deleteOne({ email: pendingUser.email });

    // 4️⃣ Create user in User collection
    let newUser;
    try {
      newUser = await User.create({
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        verified: true,
      });
    } catch (error) {
      if (error.code === 11000) {
        // User already exists, just continue
        newUser = await User.findOne({ email: userData.email });
      } else {
        throw error;
      }
    }

    // 6️⃣ Auto-login
    const loginToken = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", loginToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Email verified and logged in",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        roles: newUser.roles,
        verified: newUser.verified,
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

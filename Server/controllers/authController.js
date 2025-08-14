import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";
dotenv.config();

// Helper to sign short-lived verification token containing user payload (hashed password only)
const makeVerifyToken = ({ fullName, email, passwordHash }) => {
  const payload = {
    purpose: "email-verify",
    email: email.toLowerCase(),
    fullName,
    passwordHash, // bcrypt hash only
  };
  return jwt.sign(
    payload,
    process.env.JWT_VERIFY_SECRET || process.env.JWT_SECRET,
    {
      expiresIn: "30m", // short-lived
    }
  );
};

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // If a real user already exists with this email, block early
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password now (hash goes inside the verification token)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const verifyToken = makeVerifyToken({ fullName, email, passwordHash });

    await sendVerificationEmail(email, verifyToken); // link includes token
    return res.status(200).json({
      message:
        "Check your email to verify your account. The link expires in 30 minutes.",
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.verified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send JWT as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
      sameSite: "strict", // protect against CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      message: "Login successful",
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.purpose !== "email-verify") {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    const email = decoded.email.toLowerCase();

    // Update or insert user
    const result = await User.findOneAndUpdate(
      { email },
      {
        $set: { verified: true },
        $setOnInsert: {
          fullName: decoded.fullName,
          email,
          password: decoded.passwordHash,
        },
      },
      { upsert: true, new: true }
    );

    // Generate login JWT
    const loginToken = jwt.sign({ id: result._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Send JWT in HttpOnly cookie
    res.cookie("token", loginToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    // Respond with success
    return res.status(200).json({
      message: "Email verified and logged in",
      user: {
        id: result._id,
        fullName: result.fullName,
        email: result.email,
        role: result.role,
        verified: result.verified,
      },
    });
  } catch (err) {
    console.error("Verify error:", err);
    return res.status(400).json({ message: "Verification failed or expired" });
  }
};

export const logOut = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
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

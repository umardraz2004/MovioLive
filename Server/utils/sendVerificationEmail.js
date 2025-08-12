// utils/sendVerificationEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const baseURL = process.env.BASE_URL;

export const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or your provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationLink = `${baseURL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"MovioLive" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: `
      <h3>Welcome!</h3>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
    `,
  });
};

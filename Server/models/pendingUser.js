import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    verificationToken: {
      type: String,
      unique: true,
      required: true,
    },
    expiresAt: {
      type: Date, // ✅ type should be Date
      required: true,
    },
  },
  { timestamps: true }
);
pendingUserSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.model("pendingUser", pendingUserSchema);
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    price: { type: Number, required: true },
    viewer: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["live", "upcoming", "canceled"],
      default: "upcoming",
    },
    ticketCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("event", eventSchema);

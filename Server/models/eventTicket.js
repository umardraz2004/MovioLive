import mongoose from "mongoose";

const eventTicketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "event",
      required: true,
    },
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },
    amountPaid: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("eventTicket", eventTicketSchema);

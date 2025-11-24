import eventTicket from "../models/eventTicket.js";

// Get user's tickets
export const getUserTickets = async (req, res) => {
  try {
    const userId = req.user.id;

    const tickets = await eventTicket
      .find({
        userId,
        paymentStatus: "paid",
      })
      .populate("eventId", "title date time price status")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tickets,
      totalTickets: tickets.length,
    });
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

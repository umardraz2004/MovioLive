import Event from "../models/event.js";

const createEvent = async (req, res) => {
  const data = req.body;

  try {
    if (data) {
      const { title, date, time, price } = data;
      const userId = req.user.id;
      if (!title || !date || !time || !price) {
        return res.status(400).json({ message: "All fields are required" });
      }
      if (isNaN(price) || price < 0) {
        return res.status(400).json({
          message: "Price must be a valid positive number",
        });
      }
      const newEvent = await Event.create({
        userId,
        title,
        date,
        time,
        price: parseFloat(price),
        ticketCount: 0,
      });
      return res
        .status(201)
        .json({ message: "Event created successfully", event: newEvent });
    }
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server error while creating event" });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: 1, time: 1 }) // Sort by date and time (upcoming first)
      .select(
        "title date time price status viewer ticketCount createdAt updatedAt"
      );

    const totalEvents = events.length;

    res.status(200).json({
      message: "Events retrieved successfully",
      events,
      totalEvents,
    });
  } catch (error) {
    console.error("Error fetching all events:", error);
    res.status(500).json({ message: "Server error while fetching all events" });
  }
};

const getUserSpecificEvent = async (req, res) => {
  try {
    // Get userId from authenticated user
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Find all events for this specific user
    const events = await Event.find({ userId })
      .sort({ date: 1, time: 1 }) // Sort by date and time (upcoming first)
      .select(
        "title date time price status viewer ticketCount createdAt updatedAt"
      ); // Select specific fields

    // Count total events
    const totalUserEvents = events.length;

    res.status(200).json({
      message: "Events retrieved successfully",
      events,
      totalUserEvents,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error while fetching events" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Find the event by ID and userId to ensure user owns the event
    const event = await Event.findOne({ _id: eventId, userId });

    if (!event) {
      return res.status(404).json({
        message:
          "Event not found or you don't have permission to delete this event",
      });
    }

    // Delete the event
    await Event.findByIdAndDelete(eventId);

    res.status(200).json({
      message: "Event deleted successfully",
      eventId,
    });

    console.log(`Event deleted: ${eventId} by user: ${userId}`);
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error while deleting event" });
  }
};

export { createEvent, getAllEvents, getUserSpecificEvent, deleteEvent };

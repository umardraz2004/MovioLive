import express from "express";
import { createEvent, getAllEvents, deleteEvent } from "../controllers/eventController.js";
import { verifyToken } from "../middlewares/authMiddleWare.js";

const router = express.Router();

// POST request to create event (auth protected)
router.post("/create-event", verifyToken, createEvent);
router.get("/get-events", verifyToken, getAllEvents);
router.delete("/:eventId", verifyToken, deleteEvent);

export default router;

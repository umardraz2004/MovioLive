import express from "express";
import { createEvent, getAllEvents , getUserSpecificEvent, deleteEvent } from "../controllers/eventController.js";
import { verifyToken } from "../middlewares/authMiddleWare.js";

const router = express.Router();

// POST request to create event (auth protected)
router.post("/create-event", verifyToken, createEvent);
router.get("/get-all-events", getAllEvents);
router.get("/get-user-events", verifyToken, getUserSpecificEvent);
router.delete("/:eventId", verifyToken, deleteEvent);

export default router;

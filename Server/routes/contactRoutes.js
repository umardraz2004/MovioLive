import express from "express";
import { submitContactForm } from "../controllers/contactController.js";
import { verifyToken } from "../middlewares/authMiddleWare.js";

const router = express.Router();

// POST /api/contact - Submit contact form
router.post("/", verifyToken, submitContactForm);

export default router;

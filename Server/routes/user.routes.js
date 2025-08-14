import express from "express";
import { uploadAvatar } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleWare.js";

const router = express.Router();

// POST request to upload avatar (auth protected)
router.post("/upload-avatar", verifyToken, uploadAvatar);

export default router;

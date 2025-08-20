import express from "express";
import { uploadAvatar, updateUserName } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleWare.js";

const router = express.Router();

// POST request to upload avatar (auth protected)
router.post("/upload-avatar", verifyToken, uploadAvatar);
router.patch("/:userId/:field", verifyToken, updateUserName);

export default router;

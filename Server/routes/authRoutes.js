import express from "express";
import { verifyToken } from "../middlewares/authMiddleWare.js";
import { cookieMe, login, logOut, signUp, verifyEmail } from "../controllers/authController.js";

const router = express.Router();

router.get("/me", verifyToken, cookieMe);

// REGISTER (no DB write; email verification first)
router.post("/signup", signUp);

// VERIFY EMAIL (creates user at this step)
router.post("/verify-email", verifyEmail);

// LOGIN (send JWT as HTTP-only cookie)
router.post("/login", login);

router.post("/logout",logOut);

export default router;

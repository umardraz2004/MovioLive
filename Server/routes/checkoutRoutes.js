import express from "express";
import { verifyToken } from "../middlewares/authMiddleWare.js";
import { 
  createCheckoutSession, 
  handleWebhook, 
  getCheckoutSession,
  cancelSubscription
} from "../controllers/checkoutController.js";

const router = express.Router();

// Create checkout session (protected route)
router.post("/create-checkout-session", verifyToken, createCheckoutSession);

// Stripe webhook (no auth needed)
router.post("/webhook", express.raw({ type: 'application/json' }), handleWebhook);

// Get checkout session details (no auth needed for payment confirmation)
router.get("/session/:sessionId", getCheckoutSession);

// Cancel subscription (protected route)
router.post("/cancel-subscription", verifyToken, cancelSubscription);

export default router;
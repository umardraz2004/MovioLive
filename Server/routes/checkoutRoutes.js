import express from "express";
import { verifyToken } from "../middlewares/authMiddleWare.js";
import { 
  createCheckoutSession, 
  handleWebhook, 
  getCheckoutSession,
  getUserSubscriptionStatus,
  checkExpiredPasses,
  cancelSubscription
} from "../controllers/checkoutController.js";

const router = express.Router();

// Create checkout session (protected route)
router.post("/create-checkout-session", verifyToken, createCheckoutSession);

// Stripe webhook (no auth needed)
router.post("/webhook", express.raw({ type: 'application/json' }), handleWebhook);

// Get checkout session details (no auth needed for payment confirmation)
router.get("/session/:sessionId", getCheckoutSession);

// Get user subscription status with expiry check (protected route)
router.get("/subscription-status", verifyToken, getUserSubscriptionStatus);

// Manual check for expired passes (protected route - admin only)
router.post("/check-expired-passes", verifyToken, async (req, res) => {
  try {
    const expiredCount = await checkExpiredPasses();
    res.json({ 
      success: true, 
      message: `Checked and expired ${expiredCount} passes` 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Cancel subscription (protected route)
router.post("/cancel-subscription", verifyToken, cancelSubscription);

export default router;
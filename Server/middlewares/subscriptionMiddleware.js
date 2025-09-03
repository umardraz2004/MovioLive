import User from "../models/user.js";

export const checkSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has active subscription
    const hasActiveSubscription = user.subscriptionStatus === 'active' && 
      user.currentPeriodEnd && 
      new Date(user.currentPeriodEnd) > new Date();

    // Check if user has active one-time pass
    const hasActivePass = user.hasActivePass && 
      user.passExpiresAt && 
      new Date(user.passExpiresAt) > new Date();

    req.user.hasAccess = hasActiveSubscription || hasActivePass;
    req.user.subscription = {
      status: user.subscriptionStatus,
      planType: user.planType,
      expiresAt: user.currentPeriodEnd || user.passExpiresAt
    };

    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

export const requireSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check subscription access
    const hasActiveSubscription = user.subscriptionStatus === 'active' && 
      user.currentPeriodEnd && 
      new Date(user.currentPeriodEnd) > new Date();

    const hasActivePass = user.hasActivePass && 
      user.passExpiresAt && 
      new Date(user.passExpiresAt) > new Date();

    if (!hasActiveSubscription && !hasActivePass) {
      return res.status(403).json({ 
        message: "Active subscription required",
        requiresUpgrade: true 
      });
    }

    next();
  } catch (error) {
    console.error('Subscription requirement error:', error);
    res.status(500).json({ message: "Server error" });
  }
};
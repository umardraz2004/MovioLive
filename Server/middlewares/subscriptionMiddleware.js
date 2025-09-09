import User from "../models/user.js";

export const checkSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Auto-expire subscriptions if they're past their period end
    if (user.subscriptionStatus === 'active' && user.currentPeriodEnd) {
      const now = new Date();
      if (now > new Date(user.currentPeriodEnd)) {
        // Remove Organizer role when subscription expires
        const updatedRoles = user.roles.filter(role => role !== 'Organizer');
        
        await User.findByIdAndUpdate(userId, {
          subscriptionStatus: 'inactive',
          planType: null,
          planName: null,
          roles: updatedRoles.length > 0 ? updatedRoles : ['Audience']
        });
        
        console.log(`Auto-expired subscription for user: ${user.email}, removed Organizer role`);
        
        // Update user object
        user.subscriptionStatus = 'inactive';
        user.planType = null;
        user.planName = null;
        user.roles = updatedRoles.length > 0 ? updatedRoles : ['Audience'];
        
        req.userSubscriptionExpired = true;
        req.expiredMessage = "Your subscription has expired. Renew to continue enjoying MovioLive!";
      }
    }

    // Check if user has active subscription
    const hasActiveSubscription = user.subscriptionStatus === 'active' && 
      user.currentPeriodEnd && 
      new Date(user.currentPeriodEnd) > new Date();

    req.user.hasAccess = hasActiveSubscription;
    req.user.subscription = {
      status: user.subscriptionStatus,
      planType: user.planType,
      expiresAt: user.currentPeriodEnd,
      isExpired: req.userSubscriptionExpired || false,
      expiredMessage: req.expiredMessage || null
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

    // Auto-expire subscriptions if they're past their period end
    if (user.subscriptionStatus === 'active' && user.currentPeriodEnd) {
      const now = new Date();
      if (now > new Date(user.currentPeriodEnd)) {
        const updatedRoles = user.roles.filter(role => role !== 'Organizer');
        
        await User.findByIdAndUpdate(userId, {
          subscriptionStatus: 'inactive',
          planType: null,
          planName: null,
          roles: updatedRoles.length > 0 ? updatedRoles : ['Audience']
        });
        
        user.subscriptionStatus = 'inactive';
        user.planType = null;
        user.planName = null;
        user.roles = updatedRoles.length > 0 ? updatedRoles : ['Audience'];
        
        console.log(`Auto-expired subscription for user: ${user.email}, removed Organizer role`);
      }
    }

    // Check subscription access (after potential expiration)
    const hasActiveSubscription = user.subscriptionStatus === 'active' && 
      user.currentPeriodEnd && 
      new Date(user.currentPeriodEnd) > new Date();

    if (!hasActiveSubscription) {
      // Check if this was a recently expired subscription
      const wasExpiredSub = user.currentPeriodEnd && new Date() > new Date(user.currentPeriodEnd) && user.subscriptionStatus === 'inactive';
      
      return res.status(403).json({ 
        message: wasExpiredSub
          ? "Your subscription has expired. Renew to continue enjoying MovioLive!"
          : "Active subscription required",
        requiresUpgrade: true,
        wasExpiredSubscription: wasExpiredSub
      });
    }

    next();
  } catch (error) {
    console.error('Subscription requirement error:', error);
    res.status(500).json({ message: "Server error" });
  }
};
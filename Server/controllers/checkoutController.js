import Stripe from "stripe";
import User from "../models/user.js";
import { sendPaymentConfirmationEmail, sendCancellationConfirmationEmail } from "../utils/sendSubscriptionEmail.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Function to check and expire subscriptions
export const checkExpiredPasses = async () => {
  try {
    const now = new Date();
    
    // Find subscriptions that have expired but are still marked active
    const expiredSubUsers = await User.find({
      subscriptionStatus: 'active',
      currentPeriodEnd: { $lte: now },
      subscriptionId: { $ne: null }
    });
    
    let expiredCount = 0;
    for (const user of expiredSubUsers) {
      try {
        // Cancel ANY expired subscription in Stripe to prevent future charges
        if (user.subscriptionId) {
          await stripe.subscriptions.cancel(user.subscriptionId);
          console.log(`Canceled expired subscription in Stripe: ${user.subscriptionId} for user: ${user.email}`);
        }
        
        // COMPLETELY CLEAN UP subscription data from database - SET TO NULL, DON'T REMOVE KEYS
        await User.findByIdAndUpdate(user._id, {
          $set: {
            subscriptionId: null,
            subscriptionStatus: "inactive", 
            planName: null,
            planType: null,
            billingPeriod: null,
            currentPeriodStart: null,
            currentPeriodEnd: null,
            hasActivePass: false,
            roles: ['Audience'] // Reset to just Audience role
          }
        });
        
        expiredCount++;
        console.log(`Completely cleaned up expired subscription data for user: ${user.email}`);
      } catch (stripeError) {
        console.error(`Error canceling subscription ${user.subscriptionId}:`, stripeError);
        // Still clean up the database even if Stripe cancellation fails
        await User.findByIdAndUpdate(user._id, {
          $set: {
            subscriptionId: null,
            subscriptionStatus: "inactive",
            planName: null,
            planType: null,
            billingPeriod: null,
            currentPeriodStart: null,
            currentPeriodEnd: null,
            hasActivePass: false,
            roles: ['Audience']
          }
        });
        expiredCount++;
        console.log(`Cleaned up database for user: ${user.email} (Stripe cancellation failed)`);
      }
    }
    
    if (expiredCount > 0) {
      console.log(`Total expired subscriptions cleaned up: ${expiredCount}`);
    }
    
    return expiredCount;
  } catch (error) {
    console.error('Error checking expired subscriptions:', error);
    return 0;
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { priceId, planType, billingPeriod } = req.body;
    const userId = req.user.id; // from auth middleware

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create Stripe customer if doesn't exist
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.fullName,
        metadata: {
          userId: userId
        }
      });
      customerId = customer.id;
      
      // Save customer ID to user
      await User.findByIdAndUpdate(userId, { 
        stripeCustomerId: customerId 
      });
    }

    // All plans are now subscriptions (including daily)
    const mode = 'subscription';

    const successUrl = `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
    
    console.log('Creating checkout session with URLs:');
    console.log('Success URL:', successUrl);
    console.log('BASE_URL:', process.env.BASE_URL);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: successUrl,
      metadata: {
        userId: userId,
        planType: planType,
        billingPeriod: billingPeriod || 'monthly'
      }
    });

    res.json({ 
      success: true, 
      url: session.url,
      sessionId: session.id 
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object);
      break;
    
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;
    
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
    
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;
    
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;

    // Stripe payment flow events (normal, no action needed)
    case 'charge.succeeded':
    case 'payment_method.attached':
    case 'payment_intent.succeeded':
    case 'payment_intent.created':
    case 'invoice.created':
    case 'invoice.finalized':
    case 'invoice.paid':
      // These are normal Stripe events - no action required
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// Helper functions for webhook events
const handleCheckoutCompleted = async (session) => {
  const userId = session.metadata.userId;
  const planType = session.metadata.planType;
  const billingPeriod = session.metadata.billingPeriod || 'monthly';
  console.log('Plan Type:', planType);
  console.log('Billing Period:', billingPeriod);

  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Add Organizer role if not already present
    const updatedRoles = user.roles.includes('Organizer') 
      ? user.roles 
      : [...user.roles, 'Organizer'];

    // All payments are now handled as subscriptions (including daily)
    await User.findByIdAndUpdate(userId, {
      subscriptionStatus: 'active',
      subscriptionId: session.subscription,
      planType: planType,
      billingPeriod: billingPeriod,
      roles: updatedRoles
    });
    
    console.log(`Added Organizer role to user: ${user.email} (${planType} - ${billingPeriod})`);
  } catch (error) {
    console.error('Error handling checkout completion:', error);
  }
};

const handleSubscriptionCreated = async (subscription) => {
  try {
    const customerId = subscription.customer;
    const user = await User.findOne({ stripeCustomerId: customerId });
    
    if (user) {
      // CANCEL ANY PREVIOUS ACTIVE SUBSCRIPTIONS
      if (user.subscriptionId && user.subscriptionId !== subscription.id) {
        try {
          await stripe.subscriptions.cancel(user.subscriptionId);
          console.log(`Canceled previous subscription: ${user.subscriptionId} for user: ${user.email}`);
        } catch (cancelError) {
          console.error(`Error canceling previous subscription ${user.subscriptionId}:`, cancelError);
        }
      }
      
      // Get period dates from subscription items (they're nested there, not on main object!)
      let periodStart = null;
      let periodEnd = null;
      let planName = null;
      
      if (subscription.items && subscription.items.data && subscription.items.data.length > 0) {
        const firstItem = subscription.items.data[0];
        periodStart = firstItem.current_period_start ? new Date(firstItem.current_period_start * 1000) : null;
        periodEnd = firstItem.current_period_end ? new Date(firstItem.current_period_end * 1000) : null;
        // Get plan name from the subscription item
        planName = firstItem.price?.nickname || firstItem.plan?.nickname || null;
      }
      
      // Check if this is a daily plan and set it to cancel at period end
      const isDailyPlan = planName && planName.toLowerCase().includes('daily');
      if (isDailyPlan) {
        try {
          await stripe.subscriptions.update(subscription.id, {
            cancel_at_period_end: true
          });
          console.log(`Set daily subscription to cancel at period end: ${subscription.id}`);
        } catch (stripeError) {
          console.error(`Error setting cancel_at_period_end for ${subscription.id}:`, stripeError);
        }
      }
      
      // Determine billing period from subscription interval
      let billingPeriod = 'monthly'; // default
      if (subscription.items && subscription.items.data && subscription.items.data.length > 0) {
        const interval = subscription.items.data[0].price?.recurring?.interval;
        if (interval === 'year') {
          billingPeriod = 'yearly';
        } else if (interval === 'day') {
          billingPeriod = 'one-time'; // daily plans are treated as one-time
        }
      }
      
      // Set ALL subscription fields
      const updateData = {
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        planType: 'subscription',
        planName: planName,
        billingPeriod: billingPeriod,
        hasActivePass: true,
        roles: ['Audience', 'Organizer'] // Add Organizer role for subscribers
      };
      
      // Only set dates if they are valid
      if (periodStart && !isNaN(periodStart.getTime())) {
        updateData.currentPeriodStart = periodStart;
      }
      
      if (periodEnd && !isNaN(periodEnd.getTime())) {
        updateData.currentPeriodEnd = periodEnd;
      }
      
      await User.findByIdAndUpdate(user._id, updateData);
      console.log('Subscription created successfully for user:', user._id, 'with data:', updateData);
      
      // Send payment confirmation email
      try {
        const nextBillingDate = periodEnd ? new Date(periodEnd).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long', 
          day: 'numeric'
        }) : 'N/A';
        
        // Get the price amount from subscription
        let amount = '5.00'; // default
        if (subscription.items && subscription.items.data && subscription.items.data.length > 0) {
          const priceAmount = subscription.items.data[0].price?.unit_amount;
          if (priceAmount) {
            amount = (priceAmount / 100).toFixed(2); // Convert cents to dollars
          }
        }
        
        await sendPaymentConfirmationEmail(
          user.email,
          user.fullName,
          planName,
          amount,
          nextBillingDate
        );
        console.log('Payment confirmation email sent to:', user.email);
      } catch (emailError) {
        console.error('Failed to send payment confirmation email:', emailError);
        // Don't fail the webhook if email fails
      }
      
    } else {
      console.warn('User not found for Stripe customer:', customerId);
    }
  } catch (error) {
    console.error('Error handling subscription creation:', error);
  }
};

const handleSubscriptionUpdated = async (subscription) => {
  try {
    const user = await User.findOne({ subscriptionId: subscription.id });

    if (user) {
      // Get period dates from subscription items (they're nested there!)
      let periodStart = null;
      let periodEnd = null;
      let planName = null;
      
      if (subscription.items && subscription.items.data && subscription.items.data.length > 0) {
        const firstItem = subscription.items.data[0];
        periodStart = firstItem.current_period_start ? new Date(firstItem.current_period_start * 1000) : null;
        periodEnd = firstItem.current_period_end ? new Date(firstItem.current_period_end * 1000) : null;
        // Get plan name from the subscription item
        planName = firstItem.price?.nickname || firstItem.plan?.nickname || null;
      }
      
      // Set ALL subscription fields on update
      const updateData = {
        subscriptionStatus: subscription.status,
        hasActivePass: subscription.status === 'active',
        planName: planName
      };
      
      // Add Organizer role if subscription is active
      if (subscription.status === 'active') {
        updateData.roles = ['Audience', 'Organizer'];
      } else {
        // Remove Organizer role if subscription is not active
        updateData.roles = ['Audience'];
      }
      
      // Only update dates if they are valid
      if (periodStart && !isNaN(periodStart.getTime())) {
        updateData.currentPeriodStart = periodStart;
      }
      
      if (periodEnd && !isNaN(periodEnd.getTime())) {
        updateData.currentPeriodEnd = periodEnd;
      }
      
      await User.findByIdAndUpdate(user._id, updateData);
      console.log('Subscription updated for user:', user._id, 'with data:', updateData);
    } else {
      console.warn('User not found for subscriptionId:', subscription.id);
    }
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
};

const handleSubscriptionDeleted = async (subscription) => {
  try {
    const user = await User.findOne({ subscriptionId: subscription.id });
    
    if (user) {
      await User.findByIdAndUpdate(user._id, {
        subscriptionStatus: 'canceled',
        subscriptionId: null,
        hasActivePass: false,
        roles: ['Audience'], // Remove Organizer role when subscription is canceled
        planType: null, // Reset plan type
        planName: null, // Reset plan name
        currentPeriodStart: null, // Reset period start
        currentPeriodEnd: null // Reset period end
      });
      console.log('Subscription deleted and all fields reset for user:', user._id);
    } else {
      console.warn('User not found for subscriptionId:', subscription.id);
    }
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
};

const handlePaymentSucceeded = async (invoice) => {
  // Handle successful recurring payments
  console.log('Payment succeeded:', invoice.id);
};

const handlePaymentFailed = async (invoice) => {
  // Handle failed payments
  console.log('Payment failed:', invoice.id);
};

export const getCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Get user data to include plan name
    let userPlanName = null;
    if (session.metadata?.userId) {
      const user = await User.findById(session.metadata.userId);
      if (user) {
        userPlanName = user.planName;
      }
    }
    
    // Add payment_name to the session data
    const enrichedSession = {
      ...session,
      payment_name: userPlanName || session.metadata?.planType || 'Premium Plan'
    };
    
    res.json({
      success: true,
      session: enrichedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Cancel user's current subscription
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Check if user has any subscription data to clean up
    const hasSubscriptionData = user.subscriptionId || user.subscriptionStatus || user.planName || user.currentPeriodEnd;
    
    if (!hasSubscriptionData) {
      return res.status(404).json({ 
        success: false, 
        message: 'No subscription found to cancel' 
      });
    }
    
    // Try to cancel in Stripe if subscriptionId exists
    if (user.subscriptionId) {
      try {
        await stripe.subscriptions.cancel(user.subscriptionId);
        console.log('Successfully canceled subscription in Stripe:', user.subscriptionId);
      } catch (stripeError) {
        console.error('Stripe cancellation failed (but continuing with DB cleanup):', stripeError.message);
        // Continue with database cleanup even if Stripe fails
      }
    }
    
    // Clean up database regardless of Stripe result - SET TO EMPTY, DON'T REMOVE KEYS
    await User.findByIdAndUpdate(userId, {
      $set: {
        subscriptionId: null,
        subscriptionStatus: "inactive",
        planName: null,
        planType: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        hasActivePass: false,
        roles: ['Audience']
      }
    });
    
    console.log('Database cleanup completed for user:', user.email);
    
    // Send cancellation confirmation email
    try {
      await sendCancellationConfirmationEmail(
        user.email,
        user.fullName,
        user.planName || 'Premium Plan'
      );
      console.log('Cancellation confirmation email sent to:', user.email);
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
      // Don't fail the response if email fails
    }
    
    res.json({ 
      success: true, 
      message: 'Subscription canceled successfully' 
    });
    
  } catch (error) {
    console.error('Error in cancelSubscription function:', error);
    res.status(500).json({ 
      success: false, 
      message: `Failed to cancel subscription: ${error.message}` 
    });
  }
};
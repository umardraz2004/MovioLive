import Stripe from "stripe";
import User from "../models/user.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { priceId, planType } = req.body;
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

    // Determine session mode based on plan type
    const mode = planType === 'one-time' ? 'payment' : 'subscription';

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
      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/pricing?canceled=true`,
      metadata: {
        userId: userId,
        planType: planType
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

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// Helper functions for webhook events
const handleCheckoutCompleted = async (session) => {
  const userId = session.metadata.userId;
  const planType = session.metadata.planType;

  try {
    if (planType === 'subscription') {
      // Handle subscription creation
      await User.findByIdAndUpdate(userId, {
        subscriptionStatus: 'active',
        subscriptionId: session.subscription,
        planType: planType
      });
    } else if (planType === 'one-time') {
      // Handle one-time payment
      await User.findByIdAndUpdate(userId, {
        hasActivePass: true,
        passExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        planType: planType
      });
    }
  } catch (error) {
    console.error('Error handling checkout completion:', error);
  }
};

const handleSubscriptionCreated = async (subscription) => {
  try {
    const customerId = subscription.customer;
    const user = await User.findOne({ stripeCustomerId: customerId });
    
    if (user) {
      // Safely convert Unix timestamps to dates
      const periodStart = subscription.current_period_start ? new Date(subscription.current_period_start * 1000) : null;
      const periodEnd = subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null;
      
      // Validate dates before saving
      const updateData = {
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
      };
      
      if (periodStart && !isNaN(periodStart.getTime())) {
        updateData.currentPeriodStart = periodStart;
      }
      
      if (periodEnd && !isNaN(periodEnd.getTime())) {
        updateData.currentPeriodEnd = periodEnd;
      }
      
      await User.findByIdAndUpdate(user._id, updateData);
      console.log('Subscription created successfully for user:', user._id);
    }
  } catch (error) {
    console.error('Error handling subscription creation:', error);
  }
};

const handleSubscriptionUpdated = async (subscription) => {
  try {
    const user = await User.findOne({ subscriptionId: subscription.id });
    
    if (user) {
      await User.findByIdAndUpdate(user._id, {
        subscriptionStatus: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      });
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
        subscriptionId: null
      });
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
    
    res.json({
      success: true,
      session: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
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
  console.log(planType);

  try {
    if (planType === 'subscription') {
      // Handle subscription creation - don't set period dates here
      // They will be set by handleSubscriptionCreated event
      await User.findByIdAndUpdate(userId, {
        subscriptionStatus: 'active',
        subscriptionId: session.subscription,
        planType: planType,
        hasActivePass: true
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
    
    // LOG THE ENTIRE SUBSCRIPTION OBJECT TO SEE WHAT STRIPE IS SENDING
    console.log('=== FULL SUBSCRIPTION OBJECT ===');
    console.log(JSON.stringify(subscription, null, 2));
    console.log('current_period_start:', subscription.current_period_start);
    console.log('current_period_end:', subscription.current_period_end);
    console.log('=== END SUBSCRIPTION OBJECT ===');
    
    if (user) {
      // Get period dates from subscription items (they're nested there, not on main object!)
      let periodStart = null;
      let periodEnd = null;
      
      if (subscription.items && subscription.items.data && subscription.items.data.length > 0) {
        const firstItem = subscription.items.data[0];
        periodStart = firstItem.current_period_start ? new Date(firstItem.current_period_start * 1000) : null;
        periodEnd = firstItem.current_period_end ? new Date(firstItem.current_period_end * 1000) : null;
      }
      
      console.log('Converted dates from subscription items:');
      console.log('periodStart:', periodStart);
      console.log('periodEnd:', periodEnd);
      
      // Set ALL subscription fields
      const updateData = {
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        hasActivePass: true,
        planType: 'subscription' // or extract from subscription metadata if available
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
    
    // LOG THE ENTIRE SUBSCRIPTION OBJECT TO SEE WHAT STRIPE IS SENDING
    console.log('=== FULL SUBSCRIPTION UPDATE OBJECT ===');
    console.log(JSON.stringify(subscription, null, 2));
    console.log('current_period_start:', subscription.current_period_start);
    console.log('current_period_end:', subscription.current_period_end);
    console.log('=== END SUBSCRIPTION UPDATE OBJECT ===');
    
    if (user) {
      // Get period dates from subscription items (they're nested there!)
      let periodStart = null;
      let periodEnd = null;
      
      if (subscription.items && subscription.items.data && subscription.items.data.length > 0) {
        const firstItem = subscription.items.data[0];
        periodStart = firstItem.current_period_start ? new Date(firstItem.current_period_start * 1000) : null;
        periodEnd = firstItem.current_period_end ? new Date(firstItem.current_period_end * 1000) : null;
      }
      
      console.log('Converted update dates from subscription items:');
      console.log('periodStart:', periodStart);
      console.log('periodEnd:', periodEnd);
      
      // Set ALL subscription fields on update
      const updateData = {
        subscriptionStatus: subscription.status,
        hasActivePass: subscription.status === 'active'
      };
      
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
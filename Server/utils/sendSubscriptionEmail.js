// utils/sendSubscriptionEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send payment confirmation email
export const sendPaymentConfirmationEmail = async (email, userName, planName, amount, nextBillingDate) => {
  const isDailyPlan = planName?.toLowerCase().includes('daily');
  
  await transporter.sendMail({
    from: `"MovioLive" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🎬 Payment Successful - Welcome to MovioLive Premium!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #dc2626, #991b1b); color: white; border-radius: 10px; overflow: hidden;">
        <div style="padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🍿 Welcome to MovioLive Premium!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your payment has been processed successfully</p>
        </div>
        
        <div style="background: white; color: #333; padding: 30px; margin: 20px; border-radius: 10px;">
          <h2 style="color: #dc2626; margin-top: 0;">Payment Details</h2>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>👤 Name:</strong> ${userName}</p>
            <p><strong>📋 Plan:</strong> ${planName}</p>
            <p><strong>💰 Amount:</strong> $${amount}</p>
            ${isDailyPlan ? 
              `<p><strong>⏰ Valid Until:</strong> ${nextBillingDate} (24 hours)</p>
               <p style="color: #dc2626; font-size: 14px;"><em>⚠️ Note: Daily plans auto-cancel after 24 hours</em></p>` :
              `<p><strong>🔄 Next Billing:</strong> ${nextBillingDate}</p>`
            }
          </div>
          
          <h3 style="color: #dc2626;">🎬 Your Premium Benefits:</h3>
          <ul style="line-height: 1.8;">
            <li>✅ Unlimited movie event hosting</li>
            <li>✅ HD streaming quality</li>
            <li>✅ Advanced analytics dashboard</li>
            <li>✅ Priority customer support</li>
            <li>✅ Organizer role privileges</li>
          </ul>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.BASE_URL}/profile" style="background: linear-gradient(135deg, #dc2626, #991b1b); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              🚀 Start Creating Events
            </a>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; font-size: 14px; opacity: 0.8;">
          <p>Thank you for choosing MovioLive! 🎬</p>
          <p>Need help? Contact us at ${process.env.EMAIL_USER}</p>
        </div>
      </div>
    `,
  });
};

// Send cancellation confirmation email
export const sendCancellationConfirmationEmail = async (email, userName, planName) => {
  await transporter.sendMail({
    from: `"MovioLive" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🎬 Subscription Cancelled - Refund Processing",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 10px; overflow: hidden; border: 2px solid #e5e7eb;">
        <div style="padding: 30px; text-align: center; background: linear-gradient(135deg, #6b7280, #4b5563); color: white;">
          <h1 style="margin: 0; font-size: 28px;">📋 Subscription Cancelled</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">We've processed your cancellation request</p>
        </div>
        
        <div style="padding: 30px; color: #333;">
          <h2 style="color: #4b5563; margin-top: 0;">Cancellation Confirmed</h2>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>👤 Name:</strong> ${userName}</p>
            <p><strong>📋 Cancelled Plan:</strong> ${planName}</p>
            <p><strong>📅 Cancellation Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="background: #dcfce7; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #166534; margin-top: 0;">💰 Refund Information</h3>
            <p style="color: #15803d; margin: 0;">Your refund is being processed and will be credited to your original payment method within 5-7 business days.</p>
          </div>
          
          <h3 style="color: #4b5563;">😢 We're Sorry to See You Go!</h3>
          <p>Your account has been downgraded to the free Audience role, but you can still:</p>
          <ul style="line-height: 1.8; color: #6b7280;">
            <li>🎬 Join movie events hosted by others</li>
            <li>👥 Participate in community discussions</li>
            <li>📧 Receive updates about new features</li>
          </ul>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.BASE_URL}/pricing" style="background: linear-gradient(135deg, #dc2626, #991b1b); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 10px;">
              🔄 Resubscribe Anytime
            </a>
            <a href="${process.env.BASE_URL}/contact" style="background: #6b7280; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              💬 Contact Support
            </a>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; font-size: 14px; color: #6b7280; background: #f9fafb;">
          <p>Thank you for being part of MovioLive! 🎬</p>
          <p>Questions? Reply to this email or contact ${process.env.EMAIL_USER}</p>
        </div>
      </div>
    `,
  });
};

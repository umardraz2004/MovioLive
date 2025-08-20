import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Contact form submission handler
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: "All fields (name, email, message) are required" 
      });
    }

    // Create transporter (same as your verification email setup)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to you (the site owner)
    const emailToOwner = {
      from: `"MovioLive Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Your email address
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">New Contact Form Submission</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-left: 4px solid #ef4444; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This message was sent from your MovioLive contact form.
          </p>
        </div>
      `,
    };

    // Optional: Send confirmation email to the user
    const emailToUser = {
      from: `"MovioLive" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting MovioLive",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Thank You for Contacting Us!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for reaching out to MovioLive. We have received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Message:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p>Best regards,<br>The MovioLive Team</p>
        </div>
      `,
    };

    // Send both emails
    await transporter.sendMail(emailToOwner);
    await transporter.sendMail(emailToUser); // Optional - comment this out if you don't want to send confirmation

    return res.status(200).json({
      message: "Message sent successfully! We'll get back to you soon.",
    });

  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      message: "Failed to send message. Please try again later.",
    });
  }
};

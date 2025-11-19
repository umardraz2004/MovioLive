import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import { checkExpiredPasses } from "./controllers/checkoutController.js";
dotenv.config();

const app = express();

// Raw body parser for Stripe webhook (must be before express.json())
app.use("/api/checkout/webhook", express.raw({ type: "application/json" }));

app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ extended: true, limit: "3mb" }));

// Connect to MongoDB
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173", // ✅ exact frontend URL
    credentials: true, // ✅ allow cookies
  })
);
app.use(cookieParser());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is working ✅");
});

//routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/event", eventRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
  
  // Start periodic cleanup of expired passes
  // Check every hour (3600000 ms)
  setInterval(async () => {
    try {
      const expiredCount = await checkExpiredPasses();
      if (expiredCount > 0) {
        console.log(`🧹 Periodic cleanup: Expired ${expiredCount} one-day passes`);
      }
    } catch (error) {
      console.error('Error in periodic cleanup:', error);
    }
  }, 3600000 * 24); // Check every 24 hours
  
  // Run initial cleanup on server start
  setTimeout(async () => {
    try {
      const expiredCount = await checkExpiredPasses();
      if (expiredCount > 0) {
        console.log(`🚀 Initial cleanup: Expired ${expiredCount} one-day passes`);
      }
    } catch (error) {
      console.error('Error in initial cleanup:', error);
    }
  }, 5000); // Wait 5 seconds after server start
});

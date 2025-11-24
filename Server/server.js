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
import ticketRoutes from "./routes/ticketRoutes.js";
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
app.use("/api/tickets", ticketRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);

  // Enhanced cleanup function with better strategy
  const runCleanup = async (type = "periodic") => {
    try {
      const expiredCount = await checkExpiredPasses();
      if (expiredCount > 0) {
        const emoji = type === "initial" ? "🚀" : "🧹";
        console.log(
          `${emoji} ${type} cleanup: Processed ${expiredCount} expired passes`
        );
      } else if (type === "initial") {
        console.log("🚀 Initial cleanup: No expired passes found");
      }
    } catch (error) {
      console.error(`Error in ${type} cleanup:`, error);
    }
  };

  // Optimized cleanup strategy
  setTimeout(async () => {
    // Initial cleanup on server start
    await runCleanup("initial");

    // Reduced frequency - every 12 hours (less server load)
    // Most subscriptions expire at specific times, not randomly
    setInterval(() => runCleanup("periodic"), 3600000 * 12); // Every 12 hours

    console.log("💳 Payment expiration monitoring active");
  }, 5000);
});

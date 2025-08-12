import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173", // ✅ exact frontend URL
    credentials: true, // ✅ allow cookies
  })
);
app.use(express.json());
app.use(cookieParser());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is working ✅");
});

//routes
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

import dotenv from "dotenv";

// ==========================================
// LOAD ENVIRONMENT VARIABLES
// ==========================================

dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
const app =
  express();

// ==========================================
// ENVIRONMENT CHECK
// ==========================================

console.log(
  "=========================================="
);

console.log(
  "HOMEKART ENVIRONMENT CHECK"
);

console.log(
  "=========================================="
);

console.log(
  "MONGO_URI:",
  process.env.MONGO_URI
    ? "Loaded"
    : "Missing"
);

console.log(
  "JWT_SECRET:",
  process.env.JWT_SECRET
    ? "Loaded"
    : "Missing"
);

console.log(
  "RAZORPAY_KEY_ID:",
  process.env.RAZORPAY_KEY_ID
    ? "Loaded"
    : "Missing"
);

console.log(
  "RAZORPAY_KEY_SECRET:",
  process.env.RAZORPAY_KEY_SECRET
    ? "Loaded"
    : "Missing"
);

console.log(
  "=========================================="
);

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin:
      "http://localhost:5173",

    credentials: true,
  })
);

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==========================================
// DATABASE
// ==========================================

const connectDB =
  async () => {
    try {
      await mongoose.connect(
        process.env.MONGO_URI
      );

      console.log(
        "MongoDB connected successfully"
      );
    } catch (error) {
      console.error(
        "MongoDB Connection Failed:",
        error.message
      );

      process.exit(1);
    }
  };

// ==========================================
// HOME
// ==========================================

app.get(
  "/",
  (req, res) => {
    res.status(200).json({
      success: true,

      message:
        "HOMEKART Backend API is running",
    });
  }
);

// ==========================================
// AUTH ROUTES
// ==========================================

app.use(
  "/api/auth",
  authRoutes
);

// ==========================================
// PRODUCT ROUTES
// ==========================================

app.use(
  "/api/products",
  productRoutes
);

// ==========================================
// ORDER ROUTES
// ==========================================

app.use(
  "/api/orders",
  orderRoutes
);

// ==========================================
// PAYMENT ROUTES
// ==========================================

app.use(
  "/api/payment",
  paymentRoutes
);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// ==========================================
// 404
// ==========================================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,

      message:
        "API route not found",

      path:
        req.originalUrl,
    });
  }
);

// ==========================================
// ERROR HANDLER
// ==========================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "SERVER ERROR:",
      error
    );

    res.status(
      error.status || 500
    ).json({
      success: false,

      message:
        error.message ||
        "Internal server error",
    });
  }
);

// ==========================================
// START SERVER
// ==========================================

const PORT =
  process.env.PORT || 5000;

const startServer =
  async () => {
    await connectDB();

    app.listen(
      PORT,
      () => {
        console.log(
          `HOMEKART Server running on port ${PORT}`
        );

        console.log(`HOMEKART Server running on port ${PORT}`);
        console.log(`API server started successfully`);
        console.log(`Payments API: /api/payment`);
      }
    );
  };

startServer();
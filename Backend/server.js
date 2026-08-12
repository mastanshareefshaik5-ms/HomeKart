import dotenv from "dotenv";

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

const app = express();

// ==========================================
// ENVIRONMENT CHECK
// ==========================================

console.log("==========================================");
console.log("HOMEKART ENVIRONMENT CHECK");
console.log("==========================================");

console.log(
  "MONGO_URI:",
  process.env.MONGO_URI ? "Loaded" : "Missing"
);

console.log(
  "JWT_SECRET:",
  process.env.JWT_SECRET ? "Loaded" : "Missing"
);

console.log(
  "RAZORPAY_KEY_ID:",
  process.env.RAZORPAY_KEY_ID ? "Loaded" : "Missing"
);

console.log(
  "RAZORPAY_KEY_SECRET:",
  process.env.RAZORPAY_KEY_SECRET ? "Loaded" : "Missing"
);

console.log(
  "FRONTEND_URL:",
  process.env.FRONTEND_URL || "Missing"
);

console.log("==========================================");

// ==========================================
// CORS
// ==========================================

const allowedOrigins = [
  // Local development
  "http://localhost:5173",
  "http://localhost:5174",

  // Main HOMEKART Vercel deployment
  "https://home-kart-vd8y-liard.vercel.app",
];

// Add Render FRONTEND_URL
if (process.env.FRONTEND_URL) {
  const extraOrigins = process.env.FRONTEND_URL
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

  allowedOrigins.push(...extraOrigins);
}

console.log("ALLOWED ORIGINS:");
console.log(allowedOrigins);

// ==========================================
// CORS CONFIGURATION
// ==========================================

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin
      // Example: Postman/server-to-server
      if (!origin) {
        return callback(null, true);
      }

      // Exact allowed origins
      if (allowedOrigins.includes(origin)) {
        console.log("CORS ALLOWED:", origin);
        return callback(null, true);
      }

      // Allow Vercel preview deployments
      if (
        origin.startsWith("https://home-kart-") &&
        origin.endsWith(".vercel.app")
      ) {
        console.log(
          "CORS ALLOWED VERCEL PREVIEW:",
          origin
        );

        return callback(null, true);
      }

      console.log("CORS BLOCKED:", origin);

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==========================================
// DATABASE
// ==========================================

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

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
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "HOMEKART Backend API is running",
  });
});

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

// ==========================================
// USER ROUTES
// ==========================================

app.use(
  "/api/users",
  userRoutes
);

// ==========================================
// ADMIN ROUTES
// ==========================================

app.use(
  "/api/admin",
  adminRoutes
);

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  console.log(
    "404:",
    req.method,
    req.originalUrl
  );

  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use(
  (error, req, res, next) => {
    console.error(
      "SERVER ERROR:",
      error.message
    );

    if (
      error.message ===
      "Not allowed by CORS"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "CORS blocked this request",
      });
    }

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

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `HOMEKART Server running on port ${PORT}`
      );

      console.log(
        "API server started successfully"
      );

      console.log(
        "Auth API: /api/auth"
      );

      console.log(
        "Products API: /api/products"
      );

      console.log(
        "Orders API: /api/orders"
      );

      console.log(
        "Users API: /api/users"
      );

      console.log(
        "Admin API: /api/admin"
      );

      console.log(
        "Payments API: /api/payment"
      );
    });
  } catch (error) {
    console.error(
      "SERVER START ERROR:",
      error.message
    );

    process.exit(1);
  }
};

startServer();
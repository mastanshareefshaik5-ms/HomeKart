import express from "express";

import {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
} from "../controllers/orderController.js";

import {
  protect,
  admin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ======================================================
// CUSTOMER
// ======================================================

// Create order
router.post(
  "/",
  protect,
  createOrder
);

// My orders
router.get(
  "/my-orders",
  protect,
  getMyOrders
);

// ======================================================
// ADMIN
// IMPORTANT: /stats MUST COME BEFORE /:id
// ======================================================

// Order statistics
router.get(
  "/stats",
  protect,
  admin,
  getOrderStats
);

// All orders
router.get(
  "/",
  protect,
  admin,
  getOrders
);

// Update order status
router.put(
  "/:id/status",
  protect,
  admin,
  updateOrderStatus
);

// ======================================================
// CUSTOMER / ADMIN SINGLE ORDER
// ======================================================

// Get single order
router.get(
  "/:id",
  protect,
  getOrderById
);

// Cancel order
router.put(
  "/:id/cancel",
  protect,
  cancelOrder
);

export default router;
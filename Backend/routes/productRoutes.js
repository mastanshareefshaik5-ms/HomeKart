import express from "express";

import {
  getProducts,
  getAdminProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
} from "../controllers/productController.js";

import {
  protect,
  admin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get active products
router.get("/", getProducts);

// Get categories
router.get("/categories", getCategories);

// ==========================================
// ADMIN ROUTES
// IMPORTANT: These must come BEFORE /:id
// ==========================================

// Get all products including inactive
router.get(
  "/admin/all",
  protect,
  admin,
  getAdminProducts
);

// Create product
router.post(
  "/",
  protect,
  admin,
  createProduct
);

// Update product
router.put(
  "/:id",
  protect,
  admin,
  updateProduct
);

// Delete product
router.delete(
  "/:id",
  protect,
  admin,
  deleteProduct
);

// Restore product
router.put(
  "/:id/restore",
  protect,
  admin,
  restoreProduct
);

// ==========================================
// SINGLE PRODUCT
// ==========================================

router.get(
  "/:id",
  getProductById
);

export default router;
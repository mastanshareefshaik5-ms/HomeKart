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

// ======================================================
// PUBLIC ROUTES
// ======================================================

// Get all active products
// GET /api/products
router.get(
  "/",
  getProducts
);

// Get product categories
// GET /api/products/categories
router.get(
  "/categories",
  getCategories
);

// ======================================================
// ADMIN ROUTES
// IMPORTANT: These must come BEFORE /:id
// ======================================================

// Get all products including inactive
// GET /api/products/admin/all
router.get(
  "/admin/all",
  protect,
  admin,
  getAdminProducts
);

// Create product
// POST /api/products
router.post(
  "/",
  protect,
  admin,
  createProduct
);

// Restore deleted/inactive product
// PUT /api/products/:id/restore
router.put(
  "/:id/restore",
  protect,
  admin,
  restoreProduct
);

// Update product
// PUT /api/products/:id
router.put(
  "/:id",
  protect,
  admin,
  updateProduct
);

// Delete product
// DELETE /api/products/:id
router.delete(
  "/:id",
  protect,
  admin,
  deleteProduct
);

// ======================================================
// PUBLIC SINGLE PRODUCT
// ======================================================

// Get single product
// GET /api/products/:id
router.get(
  "/:id",
  getProductById
);

export default router;
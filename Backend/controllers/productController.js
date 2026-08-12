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

// GET active products
// GET /api/products
router.get("/", getProducts);

// GET categories
// GET /api/products/categories
router.get("/categories", getCategories);

// ======================================================
// ADMIN ROUTES
// ======================================================

// GET all products including inactive
// GET /api/products/admin/all
//
// IMPORTANT:
// This must come BEFORE /:id
router.get(
  "/admin/all",
  protect,
  admin,
  getAdminProducts
);

// CREATE product
// POST /api/products
router.post(
  "/",
  protect,
  admin,
  createProduct
);

// RESTORE product
// PUT /api/products/:id/restore
//
// IMPORTANT:
// This must come BEFORE PUT /:id
router.put(
  "/:id/restore",
  protect,
  admin,
  restoreProduct
);

// UPDATE product
// PUT /api/products/:id
router.put(
  "/:id",
  protect,
  admin,
  updateProduct
);

// DELETE product
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

// GET single product
// GET /api/products/:id
//
// Keep this AFTER the specific admin routes above.
router.get(
  "/:id",
  getProductById
);

export default router;
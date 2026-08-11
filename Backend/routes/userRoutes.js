import express from "express";

import {
  getUsers,
  getUserById,
  deleteUser,
} from "../controllers/userController.js";

import {
  protect,
  admin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// ADMIN USERS
// ==========================================

// GET ALL USERS
router.get(
  "/",
  protect,
  admin,
  getUsers
);

// GET SINGLE USER
router.get(
  "/:id",
  protect,
  admin,
  getUserById
);

// DELETE USER
router.delete(
  "/:id",
  protect,
  admin,
  deleteUser
);

export default router;
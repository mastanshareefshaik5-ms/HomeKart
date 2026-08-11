import User from "../models/User.js";

// ==========================================
// GET ALL USERS - ADMIN
// ==========================================

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
};

// ==========================================
// GET SINGLE USER - ADMIN
// ==========================================

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user",
    });
  }
};

// ==========================================
// DELETE USER - ADMIN
// ==========================================

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deleting himself
    if (
      user._id.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete user",
    });
  }
};
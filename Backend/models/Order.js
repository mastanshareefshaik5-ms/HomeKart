import mongoose from "mongoose";

// ======================================================
// ORDER ITEM SCHEMA
// ======================================================

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

// ======================================================
// ORDER SCHEMA
// ======================================================

const orderSchema = new mongoose.Schema(
  {
    // --------------------------------------------------
    // USER
    // --------------------------------------------------

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // --------------------------------------------------
    // ITEMS
    // --------------------------------------------------

    items: {
      type: [orderItemSchema],
      required: true,
    },

    // --------------------------------------------------
    // TOTAL
    // --------------------------------------------------

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // --------------------------------------------------
    // ADDRESS
    // --------------------------------------------------

    address: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    // --------------------------------------------------
    // PAYMENT
    // --------------------------------------------------

    paymentMethod: {
      type: String,
      enum: [
        "COD",
        "ONLINE",
        "RAZORPAY",
      ],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: [
        "PENDING",
        "PAID",
        "FAILED",
        "REFUNDED",
      ],
      default: "PENDING",
    },

    // --------------------------------------------------
    // ORDER STATUS
    // --------------------------------------------------

    orderStatus: {
      type: String,

      enum: [
        "PLACED",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],

      default: "PLACED",
    },

    // --------------------------------------------------
    // RAZORPAY
    // --------------------------------------------------

    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// MODEL
// ======================================================

const Order =
  mongoose.models.Order ||
  mongoose.model("Order", orderSchema);

export default Order;
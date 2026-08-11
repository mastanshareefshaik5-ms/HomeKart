import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";

// ==========================================
// RAZORPAY INSTANCE
// ==========================================

const getRazorpay = () => {
  if (
    !process.env.RAZORPAY_KEY_ID ||
    !process.env.RAZORPAY_KEY_SECRET
  ) {
    throw new Error(
      "Razorpay credentials are missing. Check Backend/.env"
    );
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// ==========================================
// CREATE RAZORPAY ORDER
// ==========================================

export const createRazorpayOrder = async (
  req,
  res
) => {
  try {
    const { orderId } = req.body;

    // Check Razorpay configuration
    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      return res.status(503).json({
        success: false,
        message:
          "Online payment is currently unavailable. Razorpay is not configured.",
      });
    }

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Find HOMEKART order
    const order =
      await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check order ownership
    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Check payment status
    if (
      order.paymentStatus === "PAID"
    ) {
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    // Create Razorpay instance
    const razorpay = getRazorpay();

    // Amount in paise
    const amount = Math.round(
      Number(order.totalAmount) * 100
    );

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Order amount must be greater than zero",
      });
    }

    // Create Razorpay order
    const razorpayOrder =
      await razorpay.orders.create({
        amount,
        currency: "INR",

        receipt:
          order._id.toString(),

        notes: {
          orderId:
            order._id.toString(),

          userId:
            req.user._id.toString(),
        },
      });

    // Save Razorpay order ID
    order.razorpayOrderId =
      razorpayOrder.id;

    // Payment method
    order.paymentMethod =
      "RAZORPAY";

    await order.save();

    return res.status(200).json({
      success: true,

      razorpayOrderId:
        razorpayOrder.id,

      amount:
        razorpayOrder.amount,

      currency:
        razorpayOrder.currency,

      key:
        process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(
      "CREATE RAZORPAY ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to create Razorpay order",
    });
  }
};

// ==========================================
// VERIFY RAZORPAY PAYMENT
// ==========================================

export const verifyRazorpayPayment =
  async (req, res) => {
    try {
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      } = req.body;

      if (
        !razorpay_payment_id ||
        !razorpay_order_id ||
        !razorpay_signature
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment details are incomplete",
        });
      }

      // Find order
      const order =
        await Order.findOne({
          razorpayOrderId:
            razorpay_order_id,

          user: req.user._id,
        });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Make sure secret exists
      if (
        !process.env.RAZORPAY_KEY_SECRET
      ) {
        return res.status(503).json({
          success: false,
          message:
            "Razorpay is not configured",
        });
      }

      // Generate signature
      const generatedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env
              .RAZORPAY_KEY_SECRET
          )
          .update(
            `${razorpay_order_id}|${razorpay_payment_id}`
          )
          .digest("hex");

      // Compare signatures
      const isValid =
        generatedSignature ===
        razorpay_signature;

      if (!isValid) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment signature",
        });
      }

      // Update payment
      order.razorpayPaymentId =
        razorpay_payment_id;

      order.paymentStatus =
        "PAID";

      await order.save();

      return res.status(200).json({
        success: true,

        message:
          "Payment verified successfully",

        order,
      });
    } catch (error) {
      console.error(
        "VERIFY RAZORPAY PAYMENT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Payment verification failed",
      });
    }
  };
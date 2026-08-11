import Order from "../models/Order.js";
import Product from "../models/Product.js";

// ======================================================
// CREATE ORDER
// ======================================================

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      address,
      phone,
      paymentMethod = "COD",
    } = req.body;

    // --------------------------------------------------
    // VALIDATE ITEMS
    // --------------------------------------------------

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message:
          "Order must contain at least one product",
      });
    }

    // --------------------------------------------------
    // VALIDATE ADDRESS
    // --------------------------------------------------

    if (!address) {
      return res.status(400).json({
        message:
          "Delivery address is required",
      });
    }

    // --------------------------------------------------
    // VALIDATE PHONE
    // --------------------------------------------------

    if (!phone) {
      return res.status(400).json({
        message:
          "Phone number is required",
      });
    }

    // --------------------------------------------------
    // VALIDATE PAYMENT METHOD
    // --------------------------------------------------

    const allowedPaymentMethods = [
      "COD",
      "ONLINE",
      "RAZORPAY",
    ];

    if (
      !allowedPaymentMethods.includes(
        paymentMethod
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid payment method",
      });
    }

    // --------------------------------------------------
    // BUILD ORDER ITEMS
    // --------------------------------------------------

    const orderItems = [];

    for (const item of items) {
      const productId =
        item.product ||
        item.productId ||
        item._id;

      if (!productId) {
        return res.status(400).json({
          message:
            "Product ID is required",
        });
      }

      const product =
        await Product.findById(
          productId
        );

      if (!product) {
        return res.status(404).json({
          message:
            `Product not found: ${productId}`,
        });
      }

      const quantity =
        Number(item.quantity) || 1;

      if (quantity <= 0) {
        return res.status(400).json({
          message:
            "Product quantity must be greater than zero",
        });
      }

      // ------------------------------------------------
      // STOCK
      // ------------------------------------------------

      if (
        Number(product.stock) <
        quantity
      ) {
        return res.status(400).json({
          message:
            `${product.name} has only ${product.stock} item(s) available`,
        });
      }

      // ------------------------------------------------
      // PRICE
      // ------------------------------------------------

      const price = Number(
        product.finalPrice ??
          product.price ??
          item.price ??
          0
      );

      const subtotal =
        price * quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price,
        quantity,
        subtotal,
      });
    }

    // --------------------------------------------------
    // CALCULATE TOTAL
    // --------------------------------------------------

    const calculatedTotal =
      orderItems.reduce(
        (total, item) =>
          total + item.subtotal,
        0
      );

    // --------------------------------------------------
    // FINAL AMOUNT
    // --------------------------------------------------

    const finalAmount =
      Number(totalAmount) > 0
        ? Number(totalAmount)
        : calculatedTotal;

    // --------------------------------------------------
    // CREATE ORDER
    // --------------------------------------------------

    const order =
      await Order.create({
        user: req.user._id,

        items: orderItems,

        totalAmount: finalAmount,

        address,

        phone,

        paymentMethod,

        paymentStatus: "PENDING",

        orderStatus: "PLACED",
      });

    // --------------------------------------------------
    // REDUCE STOCK
    // --------------------------------------------------

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: -item.quantity,
          },
        }
      );
    }

    // --------------------------------------------------
    // POPULATE
    // --------------------------------------------------

    const populatedOrder =
      await Order.findById(
        order._id
      )
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "items.product",
          "name image price"
        );

    return res.status(201).json({
      success: true,

      message:
        "Order created successfully",

      order: populatedOrder,
    });
  } catch (error) {
    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to create order",
    });
  }
};

// ======================================================
// GET ALL ORDERS - ADMIN
// ======================================================

export const getOrders = async (
  req,
  res
) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.orderStatus =
        req.query.status;
    }

    const orders =
      await Order.find(filter)
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "items.product",
          "name image price"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "GET ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to fetch orders",
    });
  }
};

// ======================================================
// GET MY ORDERS - CUSTOMER
// ======================================================

export const getMyOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find({
        user: req.user._id,
      })
        .populate(
          "items.product",
          "name image price"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "GET MY ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to fetch your orders",
    });
  }
};

// ======================================================
// GET SINGLE ORDER
// ======================================================

export const getOrderById = async (
  req,
  res
) => {
  try {
    const order =
      await Order.findById(
        req.params.id
      )
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "items.product",
          "name image price"
        );

    if (!order) {
      return res.status(404).json({
        message:
          "Order not found",
      });
    }

    const isOwner =
      order.user?._id?.toString() ===
      req.user._id.toString();

    const isAdmin =
      req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message:
          "You are not authorized to view this order",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "GET ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to fetch order",
    });
  }
};

// ======================================================
// UPDATE ORDER STATUS - ADMIN
// ======================================================

export const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    console.log(
      "UPDATE ORDER STATUS:",
      req.params.id,
      status
    );

    // --------------------------------------------------
    // EXACT STATUS VALUES USED BY MONGOOSE
    // --------------------------------------------------

    const allowedStatuses = [
      "PLACED",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ];

    // --------------------------------------------------
    // VALIDATE STATUS
    // --------------------------------------------------

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,

        message:
          `Invalid order status: ${status}`,
      });
    }

    // --------------------------------------------------
    // FIND ORDER
    // --------------------------------------------------

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,

        message:
          "Order not found",
      });
    }

    // --------------------------------------------------
    // UPDATE THE CORRECT FIELD
    // IMPORTANT:
    // orderStatus NOT order.status
    // --------------------------------------------------

    order.orderStatus = status;

    await order.save();

    // --------------------------------------------------
    // RETURN UPDATED ORDER
    // --------------------------------------------------

    const updatedOrder =
      await Order.findById(
        order._id
      )
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "items.product",
          "name image price"
        );

    return res.status(200).json({
      success: true,

      message:
        "Order status updated successfully",

      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      "UPDATE ORDER STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to update order status",
    });
  }
};

// ======================================================
// CANCEL MY ORDER
// ======================================================

export const cancelOrder = async (
  req,
  res
) => {
  try {
    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message:
          "Order not found",
      });
    }

    // --------------------------------------------------
    // CHECK OWNER
    // --------------------------------------------------

    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to cancel this order",
      });
    }

    // --------------------------------------------------
    // CANNOT CANCEL
    // --------------------------------------------------

    if (
      [
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ].includes(
        order.orderStatus
      )
    ) {
      return res.status(400).json({
        message:
          "This order cannot be cancelled",
      });
    }

    // --------------------------------------------------
    // CANCEL
    // --------------------------------------------------

    order.orderStatus =
      "CANCELLED";

    await order.save();

    // --------------------------------------------------
    // RESTORE STOCK
    // --------------------------------------------------

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: item.quantity,
          },
        }
      );
    }

    return res.status(200).json({
      success: true,

      message:
        "Order cancelled successfully",

      order,
    });
  } catch (error) {
    console.error(
      "CANCEL ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to cancel order",
    });
  }
};

// ======================================================
// ORDER STATISTICS - ADMIN
// ======================================================

export const getOrderStats = async (
  req,
  res
) => {
  try {
    const totalOrders =
      await Order.countDocuments();

    const deliveredOrders =
      await Order.countDocuments({
        orderStatus:
          "DELIVERED",
      });

    const cancelledOrders =
      await Order.countDocuments({
        orderStatus:
          "CANCELLED",
      });

    const revenueResult =
      await Order.aggregate([
        {
          $match: {
            orderStatus:
              "DELIVERED",
          },
        },

        {
          $group: {
            _id: null,

            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0]
            .totalRevenue
        : 0;

    return res.status(200).json({
      success: true,

      stats: {
        totalOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error(
      "GET ORDER STATS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to fetch order statistics",
    });
  }
};
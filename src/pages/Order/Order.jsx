import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Order.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const trackingSteps = [
  { value: "PLACED", label: "Placed" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  {
    value: "OUT_FOR_DELIVERY",
    label: "Out for Delivery",
  },
  { value: "DELIVERED", label: "Delivered" },
];

function Order() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchOrders(token);
  }, [navigate]);

  const fetchOrders = async (token) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/orders/my-orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to fetch orders"
        );
      }

      setOrders(
        Array.isArray(data.orders)
          ? data.orders
          : Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error("FETCH ORDERS ERROR:", error);

      const message = String(
        error.message || ""
      ).toLowerCase();

      if (
        message.includes("token") ||
        message.includes("unauthorized") ||
        message.includes("authorized")
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      alert(
        error.message || "Unable to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (status) => {
    if (!status) {
      return "Placed";
    }

    return String(status)
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const getStatusClass = (status) => {
    return String(status || "PLACED")
      .toLowerCase()
      .replaceAll("_", "-");
  };

  const getCurrentStep = (status) => {
    const index = trackingSteps.findIndex(
      (step) => step.value === status
    );

    return index === -1 ? 0 : index;
  };

  const isStepActive = (order, index) => {
    const currentStep = getCurrentStep(
      order.orderStatus
    );

    return index <= currentStep;
  };

  const getAddressText = (address) => {
    if (!address) {
      return "Address not available";
    }

    if (typeof address === "string") {
      return address;
    }

    return [
      address.name,
      address.address,
      address.street,
      address.city,
      address.state,
      address.pincode,
      address.zipCode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-loading">
            Loading your orders...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">

        {/* HEADER */}

        <div className="orders-header">
          <div>
            <h1>My Orders</h1>

            <p>
              View and track your HOMEKART orders.
            </p>
          </div>

          <Link
            to="/products"
            className="continue-shopping-btn"
          >
            Continue Shopping
          </Link>
        </div>

        {/* NO ORDERS */}

        {orders.length === 0 ? (
          <div className="no-orders">

            <div className="no-orders-icon">
              📦
            </div>

            <h2>
              You haven't placed any orders yet.
            </h2>

            <p>
              Start shopping to place your first
              HOMEKART order.
            </p>

            <Link
              to="/products"
              className="shop-now-btn"
            >
              Shop Now
            </Link>

          </div>
        ) : (

          /* ORDERS */

          <div className="orders-list">

            {orders.map((order) => (

              <div
                className="order-card"
                key={order._id}
              >

                {/* ORDER HEADER */}

                <div className="order-card-header">

                  <div>
                    <h2>
                      Order #
                      {String(order._id).slice(-8)}
                    </h2>

                    <p>
                      Placed on{" "}
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "-"}
                    </p>
                  </div>

                  <span
                    className={`order-status ${getStatusClass(
                      order.orderStatus
                    )}`}
                  >
                    {formatStatus(
                      order.orderStatus
                    )}
                  </span>

                </div>

                {/* SUMMARY */}

                <div className="order-summary">

                  <div>
                    <span>Total</span>

                    <strong>
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Payment</span>

                    <strong>
                      {order.paymentMethod ||
                        "COD"}
                    </strong>
                  </div>

                  <div>
                    <span>Payment Status</span>

                    <strong>
                      {formatStatus(
                        order.paymentStatus
                      )}
                    </strong>
                  </div>

                </div>

                {/* ADDRESS */}

                <div className="order-address">

                  <h3>
                    Delivery Address
                  </h3>

                  <p>
                    {getAddressText(
                      order.address
                    )}
                  </p>

                </div>

                {/* ITEMS */}

                <div className="order-items">

                  <h3>Items</h3>

                  {Array.isArray(
                    order.items
                  ) &&
                    order.items.map(
                      (item, index) => (

                        <div
                          className="order-item"
                          key={`${order._id}-${index}`}
                        >

                          {item.image ? (
                            <img
                              src={item.image}
                              alt={
                                item.name ||
                                "Product"
                              }
                            />
                          ) : (
                            <div className="order-item-placeholder">
                              🛒
                            </div>
                          )}

                          <div className="order-item-info">

                            <strong>
                              {item.name ||
                                "Product"}
                            </strong>

                            <p>
                              ₹
                              {Number(
                                item.price || 0
                              ).toLocaleString(
                                "en-IN"
                              )}
                              {" × "}
                              {item.quantity || 1}
                            </p>

                          </div>

                          <strong className="order-item-total">
                            ₹
                            {(
                              Number(
                                item.price || 0
                              ) *
                              Number(
                                item.quantity || 1
                              )
                            ).toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                              }
                            )}
                          </strong>

                        </div>
                      )
                    )}

                </div>

                {/* TRACKING */}

                <div className="order-tracking">

                  <h3>
                    Order Tracking
                  </h3>

                  <div className="status-track">

                    {trackingSteps.map(
                      (step, index) => (

                        <div
                          className={`track-step ${
                            isStepActive(
                              order,
                              index
                            )
                              ? "active"
                              : ""
                          }`}
                          key={step.value}
                        >

                          <span>
                            {isStepActive(
                              order,
                              index
                            )
                              ? "✓"
                              : index + 1}
                          </span>

                          <small>
                            {step.label}
                          </small>

                        </div>
                      )
                    )}

                  </div>

                  {/* CANCELLED */}

                  {order.orderStatus ===
                    "CANCELLED" && (
                    <div className="cancelled-message">
                      This order has been
                      cancelled.
                    </div>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Order;
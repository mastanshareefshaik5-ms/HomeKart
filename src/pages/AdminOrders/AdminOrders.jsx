import { useEffect, useState } from "react";
import "./AdminOrders.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_OPTIONS = [
  { value: "PLACED", label: "Placed" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("token");

  // ==========================================
  // FETCH ORDERS
  // ==========================================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("ADMIN ORDERS RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(
        Array.isArray(data)
          ? data
          : Array.isArray(data.orders)
          ? data.orders
          : []
      );
    } catch (error) {
      console.error("ADMIN ORDERS ERROR:", error);

      alert(
        error.message || "Unable to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const updateOrderStatus = async (
    orderId,
    newStatus
  ) => {
    if (!orderId || !newStatus) {
      return;
    }

    try {
      setUpdatingId(orderId);

      console.log(
        "UPDATING ORDER:",
        orderId,
        newStatus
      );

      const response = await fetch(
        `${API_URL}/api/orders/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "UPDATE STATUS RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update order status"
        );
      }

      const updatedOrder =
        data.order || data;

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                ...updatedOrder,
                orderStatus:
                  updatedOrder.orderStatus ||
                  newStatus,
              }
            : order
        )
      );

      alert(
        `Order status updated to ${formatStatus(
          newStatus
        )}`
      );
    } catch (error) {
      console.error(
        "UPDATE ORDER STATUS ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to update order status"
      );

      // Reload orders so UI returns to actual
      // database status
      fetchOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // STATUS FORMAT
  // ==========================================

  const formatStatus = (status) => {
    if (!status) {
      return "Placed";
    }

    return String(status)
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    const value = String(
      status || "PLACED"
    )
      .toLowerCase()
      .replaceAll("_", "-");

    return `order-status ${value}`;
  };

  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==========================================
  // USER NAME
  // ==========================================

  const getUserName = (order) => {
    if (
      order.user &&
      typeof order.user === "object"
    ) {
      return (
        order.user.name ||
        order.user.email ||
        "Customer"
      );
    }

    return "Customer";
  };

  // ==========================================
  // USER EMAIL
  // ==========================================

  const getUserEmail = (order) => {
    if (
      order.user &&
      typeof order.user === "object"
    ) {
      return order.user.email || "";
    }

    return "";
  };

  // ==========================================
  // ADDRESS
  // ==========================================

  const getAddressText = (address) => {
    if (!address) {
      return "-";
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

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-orders-page">
        <div className="admin-orders-loading">
          Loading orders...
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="admin-orders-page">

      {/* HEADER */}

      <div className="admin-orders-header">

        <div>
          <h1>Manage Orders</h1>

          <p>
            View and update customer orders.
          </p>
        </div>

        <button
          type="button"
          className="admin-orders-refresh"
          onClick={fetchOrders}
        >
          ↻ Refresh
        </button>

      </div>

      {/* EMPTY */}

      {orders.length === 0 ? (
        <div className="admin-orders-empty">

          <h2>No Orders Found</h2>

          <p>
            Customer orders will appear here
            after checkout.
          </p>

        </div>
      ) : (

        <div className="admin-orders-list">

          {orders.map((order) => {

            const currentStatus =
              order.orderStatus || "PLACED";

            return (
              <div
                className="admin-order-card"
                key={order._id}
              >

                {/* TOP */}

                <div className="admin-order-top">

                  <div>

                    <h2>
                      Order #
                      {String(
                        order._id
                      ).slice(-8)}
                    </h2>

                    <p>
                      {formatDate(
                        order.createdAt
                      )}
                    </p>

                  </div>

                  <span
                    className={getStatusClass(
                      currentStatus
                    )}
                  >
                    {formatStatus(
                      currentStatus
                    )}
                  </span>

                </div>

                {/* INFORMATION */}

                <div className="admin-order-info">

                  {/* CUSTOMER */}

                  <div>

                    <h3>
                      Customer
                    </h3>

                    <p>
                      {getUserName(
                        order
                      )}
                    </p>

                    {getUserEmail(
                      order
                    ) && (
                      <p>
                        {getUserEmail(
                          order
                        )}
                      </p>
                    )}

                    {order.phone && (
                      <p>
                        {order.phone}
                      </p>
                    )}

                  </div>

                  {/* ADDRESS */}

                  <div>

                    <h3>
                      Delivery Address
                    </h3>

                    <p>
                      {getAddressText(
                        order.address
                      )}
                    </p>

                  </div>

                  {/* PAYMENT */}

                  <div>

                    <h3>
                      Payment
                    </h3>

                    <p>
                      {order.paymentMethod ||
                        "COD"}
                    </p>

                    <p>
                      Status:{" "}
                      {order.paymentStatus ||
                        "PENDING"}
                    </p>

                  </div>

                  {/* TOTAL */}

                  <div>

                    <h3>
                      Total
                    </h3>

                    <strong>
                      ₹
                      {Number(
                        order.totalAmount ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                </div>

                {/* ITEMS */}

                <div className="admin-order-items">

                  <h3>
                    Items
                  </h3>

                  {Array.isArray(
                    order.items
                  ) &&
                    order.items.map(
                      (item, index) => (

                        <div
                          className="admin-order-item"
                          key={
                            item._id ||
                            item.product?._id ||
                            item.product ||
                            index
                          }
                        >

                          <div>
                            <strong>
                              {item.name ||
                                "Product"}
                            </strong>
                          </div>

                          <span>
                            Qty:{" "}
                            {item.quantity ||
                              1}
                          </span>

                          <span>
                            ₹
                            {Number(
                              item.price ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </span>

                        </div>
                      )
                    )}

                </div>

                {/* STATUS UPDATE */}

                <div className="admin-order-actions">

                  <label>
                    Update Status
                  </label>

                  <select
                    value={currentStatus}
                    disabled={
                      updatingId ===
                      order._id
                    }
                    onChange={(event) => {
                      const newStatus =
                        event.target.value;

                      updateOrderStatus(
                        order._id,
                        newStatus
                      );
                    }}
                  >

                    {STATUS_OPTIONS.map(
                      (option) => (

                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {option.label}
                        </option>

                      )
                    )}

                  </select>

                  {updatingId ===
                    order._id && (
                    <span>
                      Updating...
                    </span>
                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default AdminOrders;
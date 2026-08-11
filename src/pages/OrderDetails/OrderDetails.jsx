import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const statuses = [
  "PLACED",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

function OrderDetails() {
  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [cancelling, setCancelling] =
    useState(false);

  const token =
    localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchOrder();
  }, [id]);

  const fetchOrder =
    async () => {
      try {
        const response =
          await fetch(
            `${API_URL}/api/orders/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to fetch order"
          );
        }

        setOrder(
          data.order
        );
      } catch (error) {
        console.error(
          "ORDER DETAILS ERROR:",
          error
        );

        alert(
          error.message ||
            "Unable to load order"
        );

        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

  const cancelOrder =
    async () => {
      const confirmed =
        window.confirm(
          "Are you sure you want to cancel this order?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setCancelling(true);

        const response =
          await fetch(
            `${API_URL}/api/orders/${id}/cancel`,
            {
              method: "PUT",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to cancel order"
          );
        }

        alert(
          "Order cancelled successfully."
        );

        setOrder(
          data.order
        );
      } catch (error) {
        alert(
          error.message ||
            "Unable to cancel order"
        );
      } finally {
        setCancelling(false);
      }
    };

  const getStatusIndex =
    () => {
      if (
        !order ||
        order.orderStatus ===
          "CANCELLED"
      ) {
        return -1;
      }

      return statuses.indexOf(
        order.orderStatus
      );
    };

  if (loading) {
    return (
      <div>
        <h2>
          Loading order...
        </h2>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <h2>
          Order not found
        </h2>
      </div>
    );
  }

  const currentStatus =
    getStatusIndex();

  return (
    <div
      className="order-details-page"
      style={{
        padding: "30px",
        maxWidth:
          "1000px",
        margin:
          "0 auto",
      }}
    >
      <button
        onClick={() =>
          navigate("/orders")
        }
      >
        ← My Orders
      </button>

      <h1>
        Order Details
      </h1>

      {/* =================================
          ORDER HEADER
      ================================= */}

      <div
        style={{
          border:
            "1px solid #ddd",
          padding:
            "20px",
          borderRadius:
            "10px",
          marginBottom:
            "25px",
        }}
      >
        <h2>
          {order.orderNumber}
        </h2>

        <p>
          Placed on{" "}
          {new Date(
            order.createdAt
          ).toLocaleString()}
        </p>

        <p>
          <strong>
            Total:
          </strong>{" "}
          ₹
          {Number(
            order.totalAmount
          ).toFixed(2)}
        </p>

        <p>
          <strong>
            Payment:
          </strong>{" "}
          {order.paymentMethod}
          {" — "}
          {order.paymentStatus}
        </p>

        <p>
          <strong>
            Status:
          </strong>{" "}
          {order.orderStatus.replaceAll(
            "_",
            " "
          )}
        </p>
      </div>

      {/* =================================
          TRACKING
      ================================= */}

      {order.orderStatus ===
      "CANCELLED" ? (
        <div
          style={{
            border:
              "1px solid #ddd",
            padding:
              "20px",
            borderRadius:
              "10px",
            marginBottom:
              "25px",
          }}
        >
          <h2>
            Order Cancelled
          </h2>

          {order.cancelledAt && (
            <p>
              Cancelled on{" "}
              {new Date(
                order.cancelledAt
              ).toLocaleString()}
            </p>
          )}
        </div>
      ) : (
        <div
          style={{
            border:
              "1px solid #ddd",
            padding:
              "20px",
            borderRadius:
              "10px",
            marginBottom:
              "25px",
          }}
        >
          <h2>
            Order Tracking
          </h2>

          <div
            style={{
              display:
                "flex",
              flexDirection:
                "column",
              gap:
                "15px",
            }}
          >
            {statuses.map(
              (
                status,
                index
              ) => {
                const completed =
                  index <=
                  currentStatus;

                const current =
                  index ===
                  currentStatus;

                return (
                  <div
                    key={
                      status
                    }
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap:
                        "12px",
                    }}
                  >
                    <div
                      style={{
                        width:
                          "25px",
                        height:
                          "25px",
                        borderRadius:
                          "50%",
                        background:
                          completed
                            ? "#2e7d32"
                            : "#ddd",
                        color:
                          "white",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        fontSize:
                          "13px",
                      }}
                    >
                      {completed
                        ? "✓"
                        : index +
                          1}
                    </div>

                    <div>
                      <strong>
                        {status.replaceAll(
                          "_",
                          " "
                        )}
                      </strong>

                      {current && (
                        <div>
                          Current
                          status
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* =================================
          ITEMS
      ================================= */}

      <div
        style={{
          border:
            "1px solid #ddd",
          padding:
            "20px",
          borderRadius:
            "10px",
          marginBottom:
            "25px",
        }}
      >
        <h2>
          Items
        </h2>

        {order.items.map(
          (
            item,
            index
          ) => (
            <div
              key={`${item.product}-${index}`}
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap:
                  "15px",
                padding:
                  "10px 0",
                borderBottom:
                  "1px solid #eee",
              }}
            >
              {item.image && (
                <img
                  src={
                    item.image
                  }
                  alt={
                    item.name
                  }
                  style={{
                    width:
                      "80px",
                    height:
                      "80px",
                    objectFit:
                      "cover",
                    borderRadius:
                      "8px",
                  }}
                />
              )}

              <div>
                <h3>
                  {item.name}
                </h3>

                <p>
                  ₹
                  {Number(
                    item.price
                  ).toFixed(
                    2
                  )}{" "}
                  ×{" "}
                  {
                    item.quantity
                  }
                </p>

                <p>
                  Subtotal: ₹
                  {Number(
                    item.subtotal
                  ).toFixed(
                    2
                  )}
                </p>
              </div>
            </div>
          )
        )}
      </div>

      {/* =================================
          DELIVERY ADDRESS
      ================================= */}

      <div
        style={{
          border:
            "1px solid #ddd",
          padding:
            "20px",
          borderRadius:
            "10px",
          marginBottom:
            "25px",
        }}
      >
        <h2>
          Delivery Address
        </h2>

        <p>
          <strong>
            {
              order.address
                ?.fullName
            }
          </strong>
        </p>

        <p>
          {
            order.address
              ?.addressLine
          }
        </p>

        <p>
          {
            order.address
              ?.city
          }
          ,{" "}
          {
            order.address
              ?.state
          }
        </p>

        <p>
          Pincode:{" "}
          {
            order.address
              ?.pincode
          }
        </p>

        <p>
          Phone:{" "}
          {
            order.address
              ?.phone
          }
        </p>
      </div>

      {/* =================================
          PRICE SUMMARY
      ================================= */}

      <div
        style={{
          border:
            "1px solid #ddd",
          padding:
            "20px",
          borderRadius:
            "10px",
          marginBottom:
            "25px",
        }}
      >
        <h2>
          Price Summary
        </h2>

        <p>
          Subtotal: ₹
          {Number(
            order.subtotal
          ).toFixed(2)}
        </p>

        <p>
          Delivery:{" "}
          {order.deliveryCharge ===
          0
            ? "FREE"
            : `₹${Number(
                order.deliveryCharge
              ).toFixed(
                2
              )}`}
        </p>

        <h2>
          Total: ₹
          {Number(
            order.totalAmount
          ).toFixed(2)}
        </h2>
      </div>

      {/* =================================
          CANCEL
      ================================= */}

      {[
        "PLACED",
        "CONFIRMED",
        "PROCESSING",
      ].includes(
        order.orderStatus
      ) && (
        <button
          onClick={
            cancelOrder
          }
          disabled={
            cancelling
          }
        >
          {cancelling
            ? "Cancelling..."
            : "Cancel Order"}
        </button>
      )}
    </div>
  );
}

export default OrderDetails;
import { useEffect, useState } from "react";
import "./AdminReports.css";

function AdminReports() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(
        Array.isArray(data)
          ? data
          : data.orders || []
      );
    } catch (error) {
      console.error(
        "ADMIN REPORTS ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to load reports"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const deliveredOrders = orders.filter(
    (order) =>
      order.orderStatus === "DELIVERED"
  );

  const cancelledOrders = orders.filter(
    (order) =>
      order.orderStatus === "CANCELLED"
  );

  const activeOrders = orders.filter(
    (order) =>
      order.orderStatus !== "DELIVERED" &&
      order.orderStatus !== "CANCELLED"
  );

  const totalRevenue = deliveredOrders.reduce(
    (total, order) =>
      total + Number(order.totalAmount || 0),
    0
  );

  const totalOrderValue = orders.reduce(
    (total, order) =>
      total + Number(order.totalAmount || 0),
    0
  );

  const averageOrderValue =
    orders.length > 0
      ? totalOrderValue / orders.length
      : 0;

  const getItemsCount = (order) => {
    if (!Array.isArray(order.items)) {
      return 0;
    }

    return order.items.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
  };

  const totalItems = orders.reduce(
    (total, order) =>
      total + getItemsCount(order),
    0
  );

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2
      }
    )}`;

  return (
    <div className="admin-page">

      <div className="admin-page-header">

        <div>
          <h1>Business Reports</h1>

          <p>
            HOMEKART sales and order
            performance
          </p>
        </div>

        <button
          type="button"
          className="admin-refresh-btn"
          onClick={fetchOrders}
        >
          ↻ Refresh
        </button>

      </div>


      {loading ? (

        <div className="admin-loading">
          Loading reports...
        </div>

      ) : (

        <>

          <div className="admin-stat-grid">

            <div className="admin-stat-card">

              <span>📦</span>

              <div>

                <h3>
                  {orders.length}
                </h3>

                <p>
                  Total Orders
                </p>

              </div>

            </div>


            <div className="admin-stat-card">

              <span>🚚</span>

              <div>

                <h3>
                  {deliveredOrders.length}
                </h3>

                <p>
                  Delivered Orders
                </p>

              </div>

            </div>


            <div className="admin-stat-card">

              <span>⏳</span>

              <div>

                <h3>
                  {activeOrders.length}
                </h3>

                <p>
                  Active Orders
                </p>

              </div>

            </div>


            <div className="admin-stat-card">

              <span>❌</span>

              <div>

                <h3>
                  {cancelledOrders.length}
                </h3>

                <p>
                  Cancelled Orders
                </p>

              </div>

            </div>

          </div>


          <div className="admin-stat-grid">

            <div className="admin-stat-card">

              <span>💰</span>

              <div>

                <h3>
                  {formatCurrency(
                    totalRevenue
                  )}
                </h3>

                <p>
                  Delivered Revenue
                </p>

              </div>

            </div>


            <div className="admin-stat-card">

              <span>₹</span>

              <div>

                <h3>
                  {formatCurrency(
                    totalOrderValue
                  )}
                </h3>

                <p>
                  Total Order Value
                </p>

              </div>

            </div>


            <div className="admin-stat-card">

              <span>📊</span>

              <div>

                <h3>
                  {formatCurrency(
                    averageOrderValue
                  )}
                </h3>

                <p>
                  Average Order Value
                </p>

              </div>

            </div>


            <div className="admin-stat-card">

              <span>🛒</span>

              <div>

                <h3>
                  {totalItems}
                </h3>

                <p>
                  Products Ordered
                </p>

              </div>

            </div>

          </div>


          <div className="admin-dashboard-section">

            <h2>
              Order Performance
            </h2>


            <div className="admin-report-card">

              <div className="report-row">

                <span>
                  Total Orders
                </span>

                <strong>
                  {orders.length}
                </strong>

              </div>


              <div className="report-row">

                <span>
                  Delivered
                </span>

                <strong>
                  {deliveredOrders.length}
                </strong>

              </div>


              <div className="report-row">

                <span>
                  Active
                </span>

                <strong>
                  {activeOrders.length}
                </strong>

              </div>


              <div className="report-row">

                <span>
                  Cancelled
                </span>

                <strong>
                  {cancelledOrders.length}
                </strong>

              </div>

            </div>

          </div>


          <div className="admin-dashboard-section">

            <h2>
              Revenue Summary
            </h2>


            <div className="admin-report-card">

              <div className="report-row">

                <span>
                  Delivered Revenue
                </span>

                <strong>
                  {formatCurrency(
                    totalRevenue
                  )}
                </strong>

              </div>


              <div className="report-row">

                <span>
                  Total Order Value
                </span>

                <strong>
                  {formatCurrency(
                    totalOrderValue
                  )}
                </strong>

              </div>


              <div className="report-row">

                <span>
                  Average Order Value
                </span>

                <strong>
                  {formatCurrency(
                    averageOrderValue
                  )}
                </strong>

              </div>


              <div className="report-row">

                <span>
                  Total Items Sold
                </span>

                <strong>
                  {totalItems}
                </strong>

              </div>

            </div>

          </div>

        </>

      )}

    </div>
  );
}

export default AdminReports;
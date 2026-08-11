import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Admin.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/orders/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load dashboard"
          );
        }

        const result = data.stats || data;

        setStats({
          totalOrders:
            result.totalOrders || 0,

          deliveredOrders:
            result.deliveredOrders || 0,

          cancelledOrders:
            result.cancelledOrders || 0,

          totalRevenue:
            result.totalRevenue || 0
        });
      } catch (error) {
        console.error(
          "ADMIN DASHBOARD ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">

      <div className="admin-dashboard-header">

        <h1>Admin Dashboard</h1>

        <p>
          Welcome to HOMEKART administration
        </p>

      </div>


      <div className="admin-stat-grid">

        <div className="admin-stat-card">

          <span>📦</span>

          <div>

            <h3>
              {loading
                ? "..."
                : stats.totalOrders}
            </h3>

            <p>Total Orders</p>

          </div>

        </div>


        <div className="admin-stat-card">

          <span>🚚</span>

          <div>

            <h3>
              {loading
                ? "..."
                : stats.deliveredOrders}
            </h3>

            <p>Delivered Orders</p>

          </div>

        </div>


        <div className="admin-stat-card">

          <span>❌</span>

          <div>

            <h3>
              {loading
                ? "..."
                : stats.cancelledOrders}
            </h3>

            <p>Cancelled Orders</p>

          </div>

        </div>


        <div className="admin-stat-card">

          <span>💰</span>

          <div>

            <h3>
              {loading
                ? "..."
                : `₹${Number(
                    stats.totalRevenue
                  ).toLocaleString("en-IN")}`}
            </h3>

            <p>Total Revenue</p>

          </div>

        </div>

      </div>


      <div className="admin-dashboard-section">

        <h2>Quick Management</h2>

        <div className="admin-action-grid">

          <Link
            to="/admin/products"
            className="admin-action-card"
          >

            <span>🛍️</span>

            <h3>Products</h3>

            <p>
              Add, edit and manage products
            </p>

          </Link>


          <Link
            to="/admin/orders"
            className="admin-action-card"
          >

            <span>📦</span>

            <h3>Orders</h3>

            <p>
              View and update customer orders
            </p>

          </Link>


          <Link
            to="/admin/users"
            className="admin-action-card"
          >

            <span>👥</span>

            <h3>Users</h3>

            <p>
              View registered customers
            </p>

          </Link>


          <Link
            to="/admin/reports"
            className="admin-action-card"
          >

            <span>📊</span>

            <h3>Reports</h3>

            <p>
              View HOMEKART business reports
            </p>

          </Link>

        </div>

      </div>


      <div className="admin-dashboard-section">

        <h2>Product Management</h2>

        <div className="admin-product-actions">

          <Link
            to="/admin/products"
            className="admin-primary-btn"
          >
            Manage Products
          </Link>

          <Link
            to="/admin/products/add"
            className="admin-add-btn"
          >
            + Add Product
          </Link>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;
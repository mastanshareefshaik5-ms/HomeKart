import React, { useEffect, useState } from "react";
import "./AdminReports.css";

function AdminReports() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken")
    );
  };

  const loadReports = async () => {
    try {
      setLoading(true);

      const token = getToken();

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const [productsResponse, ordersResponse, usersResponse] =
        await Promise.all([
          fetch("http://localhost:5000/api/products"),
          fetch("http://localhost:5000/api/orders/admin", {
            headers
          }),
          fetch("http://localhost:5000/api/auth/users", {
            headers
          })
        ]);

      const productsData = await productsResponse.json();
      const ordersData = await ordersResponse.json();
      const usersData = await usersResponse.json();

      setProducts(
        Array.isArray(productsData)
          ? productsData
          : productsData.products || []
      );

      setOrders(
        Array.isArray(ordersData)
          ? ordersData
          : ordersData.orders || []
      );

      setUsers(
        Array.isArray(usersData)
          ? usersData
          : usersData.users || []
      );

    } catch (error) {
      console.error("Reports error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const totalSales = orders.reduce(
    (total, order) =>
      total + Number(order.totalAmount || order.total || 0),
    0
  );

  const pendingOrders = orders.filter(
    (order) =>
      (order.status || "Pending").toLowerCase() === "pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      (order.status || "").toLowerCase() === "delivered"
  ).length;

  if (loading) {
    return (
      <div className="reports-loading">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="admin-reports">

      <div className="reports-header">

        <div>
          <h1>Store Reports</h1>
          <p>
            HOMEKART store overview and statistics.
          </p>
        </div>

        <button
          className="refresh-report-btn"
          onClick={loadReports}
        >
          🔄 Refresh
        </button>

      </div>

      <div className="report-cards">

        <div className="report-card">
          <div className="report-icon">📦</div>

          <h3>Total Products</h3>

          <strong>
            {products.length}
          </strong>
        </div>


        <div className="report-card">
          <div className="report-icon">👥</div>

          <h3>Total Users</h3>

          <strong>
            {users.length}
          </strong>
        </div>


        <div className="report-card">
          <div className="report-icon">🛒</div>

          <h3>Total Orders</h3>

          <strong>
            {orders.length}
          </strong>
        </div>


        <div className="report-card">
          <div className="report-icon">💰</div>

          <h3>Total Sales</h3>

          <strong>
            ₹{totalSales.toFixed(2)}
          </strong>
        </div>

      </div>


      <div className="report-secondary">

        <div className="report-box">

          <h2>Order Status</h2>

          <div className="status-row">
            <span>Pending</span>
            <strong>{pendingOrders}</strong>
          </div>

          <div className="status-row">
            <span>Delivered</span>
            <strong>{deliveredOrders}</strong>
          </div>

        </div>


        <div className="report-box">

          <h2>HOMEKART Summary</h2>

          <p>
            Products: <strong>{products.length}</strong>
          </p>

          <p>
            Customers: <strong>{users.length}</strong>
          </p>

          <p>
            Orders: <strong>{orders.length}</strong>
          </p>

          <p>
            Sales: <strong>₹{totalSales.toFixed(2)}</strong>
          </p>

        </div>

      </div>

    </div>
  );
}

export default AdminReports;
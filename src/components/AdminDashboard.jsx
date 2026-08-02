import React from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {

  return (
    <div className="admin-dashboard">

      <div className="admin-title">
        <h1>HOMEKART Admin Dashboard</h1>
        <p>Manage your online store from one place.</p>
      </div>

      <div className="admin-cards">

        <Link to="/admin/products" className="admin-card">
          <div className="admin-card-icon">📦</div>
          <h2>Products</h2>
          <p>Manage products and inventory</p>
        </Link>

        <Link to="/admin/orders" className="admin-card">
          <div className="admin-card-icon">🛒</div>
          <h2>Orders</h2>
          <p>View and manage customer orders</p>
        </Link>

        <Link to="/admin/users" className="admin-card">
          <div className="admin-card-icon">👥</div>
          <h2>Users</h2>
          <p>Manage registered customers</p>
        </Link>

        <Link to="/admin/reports" className="admin-card">
          <div className="admin-card-icon">📊</div>
          <h2>Reports</h2>
          <p>View store statistics and reports</p>
        </Link>

      </div>

    </div>
  );
}

export default AdminDashboard;
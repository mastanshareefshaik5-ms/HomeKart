import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

import "./Admin.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="admin-message">
        <h2>Please login first.</h2>

        <Link to="/login">
          Go to Login
        </Link>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="admin-message">
        <h2>Access Denied</h2>

        <p>
          You do not have administrator permission.
        </p>

        <Link to="/">
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-page">

      <aside className="admin-sidebar">

        <div className="admin-logo">
          🏠 HOMEKART
        </div>

        <div className="admin-title">
          Admin Panel
        </div>

        <nav>

          <Link to="/admin">
            📊 Dashboard
          </Link>

          <Link to="/admin/products">
            📦 Products
          </Link>

          <Link to="/admin/orders">
            🛒 Orders
          </Link>

          <Link to="/admin/users">
            👥 Users
          </Link>

        </nav>

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>


      <main className="admin-content">

        <div className="admin-header">

          <div>
            <h1>
              Admin Dashboard
            </h1>

            <p>
              Welcome, {user.name}
            </p>
          </div>

          <div className="admin-user">
            👨‍💼 {user.email}
          </div>

        </div>


        <div className="admin-cards">

          <div className="admin-card">
            <span>📦</span>
            <h2>Products</h2>
            <p>Manage HOMEKART products</p>

            <Link to="/admin/products">
              Manage Products
            </Link>
          </div>


          <div className="admin-card">
            <span>🛒</span>
            <h2>Orders</h2>
            <p>View customer orders</p>

            <Link to="/admin/orders">
              View Orders
            </Link>
          </div>


          <div className="admin-card">
            <span>👥</span>
            <h2>Users</h2>
            <p>Manage registered users</p>

            <Link to="/admin/users">
              View Users
            </Link>
          </div>


          <div className="admin-card">
            <span>📊</span>
            <h2>Reports</h2>
            <p>HOMEKART business overview</p>

            <button>
              View Reports
            </button>
          </div>

        </div>


        <div className="admin-welcome">

          <h2>
            HOMEKART Administration
          </h2>

          <p>
            From this dashboard you can manage
            products, orders and customers.
          </p>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;
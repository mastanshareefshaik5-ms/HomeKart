import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingBag,
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";

import { AuthContext } from "../../context/AuthContext";

import "./AdminLayout.css";

function AdminLayout() {

  const navigate = useNavigate();

  const { logout } = useContext(AuthContext);

  const handleLogout = () => {

    if (logout) {
      logout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    navigate("/login");
  };


  return (
    <div className="admin-layout">

      {/* =========================================
          ADMIN NAVBAR
      ========================================= */}

      <header className="admin-navbar">

        <div className="admin-logo">
          HOMEKART ADMIN
        </div>


        <nav className="admin-nav-links">

          <Link to="/admin">
            <FaTachometerAlt />
            Dashboard
          </Link>

          <Link to="/admin/products">
            <FaBox />
            Products
          </Link>

          <Link to="/admin/orders">
            <FaShoppingBag />
            Orders
          </Link>

          <Link to="/admin/users">
            <FaUsers />
            Users
          </Link>

          <Link to="/admin/reports">
            <FaChartBar />
            Reports
          </Link>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            Logout
          </button>

        </nav>

      </header>


      {/* =========================================
          ADMIN CONTENT
      ========================================= */}

      <main className="admin-content">

        <Outlet />

      </main>

    </div>
  );
}

export default AdminLayout;
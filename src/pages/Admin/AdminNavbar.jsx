import { Link, useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

function AdminNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="admin-navbar">

      <div className="admin-navbar-logo">
        <Link to="/admin">
          HOMEKART ADMIN
        </Link>
      </div>

      <div className="admin-navbar-links">

        <Link to="/admin">
          Dashboard
        </Link>

        <Link to="/admin/products">
          Products
        </Link>

        <Link to="/admin/orders">
          Orders
        </Link>

        <Link to="/admin/users">
          Users
        </Link>

        <Link to="/admin/reports">
          Reports
        </Link>

        <button
          type="button"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default AdminNavbar;
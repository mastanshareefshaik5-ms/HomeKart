import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaPhone,
  FaBoxOpen,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";

import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

import "./Navbar.css";

function Navbar() {
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  // ==========================================
  // CART COUNT
  // ==========================================

  const cartCount = Array.isArray(cartItems)
    ? cartItems.reduce(
        (total, item) =>
          total + Number(item.quantity || 1),
        0
      )
    : 0;

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    navigate("/login");
  };

  // ==========================================
  // USER DISPLAY NAME
  // ==========================================

  const displayName = user?.name?.trim()
    ? user.name
    : "User";

  // ==========================================
  // NAVBAR
  // ==========================================

  return (
    <header>

      {/* ==========================================
          TOP BAR
      ========================================== */}

      <div className="top-bar">

      <div className="customer-contact">

        <a href="tel:+919959820059">
          <FaPhone />
          Customer Care : +91 9959820059
        </a>

        <a href="mailto:johnsaida374@gmail.com">
          📧 johnsaida374@gmail.com
        </a>

      </div>

        <div>
        Premium Grocery Store
      </div>

      </div>
      {/* ==========================================
          MAIN NAVBAR
      ========================================== */}

      <div className="navbar-main">

        {/* LOGO */}

        <Link
          to="/"
          className="navbar-logo"
        >
          <h1>HOMEKART</h1>

          <p>
            Fresh • Trusted • Delivered
          </p>
        </Link>

        {/* SEARCH */}

        <div className="navbar-search">

          <input
            type="text"
            placeholder="Search products..."
          />

          <button type="button">
            <FaSearch />
          </button>

        </div>

        {/* ACTIONS */}

        <div className="navbar-actions">

          {/* WISHLIST */}

          <Link
            to="/wishlist"
            title="Wishlist"
          >
            <FaHeart />
          </Link>

          {/* CART */}

          <Link
            to="/cart"
            className="cart-link"
            title="Cart"
          >

            <FaShoppingCart />

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}

          </Link>

          {/* USER */}

          {user ? (
            <>

              <div className="navbar-user">

                <FaUser />

                <Link
                  to="/profile"
                  className="navbar-profile-link"
                  title="Edit Profile"
                >
                  {displayName}
                </Link>

              </div>

              {/* LOGOUT */}

              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
                title="Logout"
              >
                <FaSignOutAlt />
              </button>

            </>
          ) : (

            <Link
              to="/login"
              className="login-link"
            >

              <FaUser />

              <span>
                Login
              </span>

            </Link>

          )}

        </div>

      </div>

      {/* ==========================================
          GREEN MENU
      ========================================== */}

      <nav className="navbar-menu">

        <Link to="/">
          Home
        </Link>

        <Link to="/products">
          Products
        </Link>

        <Link to="/order">

          <FaBoxOpen />

          Orders

        </Link>

        <Link to="/wishlist">

          <FaHeart />

          Wishlist

        </Link>

        <Link to="/contact">

          <FaPhone />

          Contact

        </Link>

      </nav>

    </header>
  );
}

export default Navbar;
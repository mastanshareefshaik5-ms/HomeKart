import "./Navbar.css";

import {
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaBoxOpen,
  FaSignOutAlt
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

import { CartContext } from "../../context/CartContext";

function Navbar() {

  const { cartItems } = useContext(CartContext);

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // Check logged-in user
  useEffect(() => {

    const savedUser =
      JSON.parse(
        localStorage.getItem("user")
      );

    setUser(savedUser);

  }, []);

  // Cart count
  const cartCount = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  // Logout
  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");

  };

  return (

    <nav className="navbar">

      {/* LOGO */}

      <Link
        to="/"
        className="navbar-logo"
      >
        🏠 HOMEKART
      </Link>


      {/* NAVIGATION */}

      <div className="navbar-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/products">
          Products
        </Link>

        <Link to="/categories">
          Categories
        </Link>

        <Link to="/order">
          <FaBoxOpen />
          Orders
        </Link>

        <Link to="/wishlist">
          <FaHeart />
          Wishlist
        </Link>

        <Link to="/cart">

          <FaShoppingCart />

          Cart

          {cartCount > 0 && (

            <span className="cart-count">
              {cartCount}
            </span>

          )}

        </Link>


        {/* LOGIN / USER */}

        {user ? (

          <>

            <span className="navbar-user">
              <FaUser />
              {user.name || "User"}
            </span>

            <button
              className="navbar-logout"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              Logout
            </button>

          </>

        ) : (

          <Link to="/login">

            <FaUser />

            Login

          </Link>

        )}

      </div>

    </nav>

  );
}

export default Navbar;
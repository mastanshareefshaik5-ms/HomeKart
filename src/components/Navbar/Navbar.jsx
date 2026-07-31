import { useEffect, useState } from "react";
import {
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaMapMarkerAlt,
  FaSignOutAlt
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

import "./Navbar.css";

function Navbar() {

  const { cartItems } = useContext(CartContext);

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");
  };

  return (

    <nav className="navbar">

      {/* Logo */}

      <Link to="/" className="navbar-logo">
        🏠 HOMEKART
      </Link>


      {/* Search */}

      <div className="search-box">

        <input
          type="text"
          placeholder="Search household products..."
        />

        <button>
          Search
        </button>

      </div>


      {/* Location */}

      <div className="navbar-location">

        <FaMapMarkerAlt />

        <div>
          <small>Deliver to</small>
          <strong>India</strong>
        </div>

      </div>


      {/* User */}

      {user ? (

        <div className="navbar-user">

          <FaUser />

          <div>
            <small>Hello,</small>

            <strong>
              {user.name}
            </strong>
          </div>

        </div>

      ) : (

        <Link
          to="/login"
          className="navbar-login"
        >

          <FaUser />

          <div>
            <small>Hello,</small>
            <strong>Login</strong>
          </div>

        </Link>

      )}


      {/* Wishlist */}

      <Link
        to="/wishlist"
        className="navbar-icon"
      >

        <FaHeart />

        <span>Wishlist</span>

      </Link>


      {/* Cart */}

      <Link
        to="/cart"
        className="navbar-cart"
      >

        <FaShoppingCart />

        <span>
          Cart ({cartItems.length})
        </span>

      </Link>


      {/* Logout */}

      {user && (

        <button
          className="logout-button"
          onClick={handleLogout}
        >

          <FaSignOutAlt />

          Logout

        </button>

      )}

    </nav>

  );
}

export default Navbar;
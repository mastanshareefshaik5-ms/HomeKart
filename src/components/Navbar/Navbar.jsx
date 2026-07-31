import { FaSearch, FaHeart, FaShoppingCart, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="navbar-logo">
        <span>🏠</span>
        HOMEKART
      </div>

      <div className="delivery-location">
        <FaMapMarkerAlt />
        <div>
          <small>Deliver to</small>
          <strong>Select Location</strong>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search for chilli powder, rice, oil..."
        />
        <button>
          <FaSearch />
        </button>
      </div>

      <div className="navbar-actions">

        <div className="nav-item">
          <FaUser />
          <span>Login</span>
        </div>

        <div className="nav-item">
          <FaHeart />
          <span>Wishlist</span>
        </div>

        <div className="nav-item cart">
          <FaShoppingCart />
          <span>Cart</span>
          <b>0</b>
        </div>

      </div>

    </nav>
  );
}

export default Navbar;
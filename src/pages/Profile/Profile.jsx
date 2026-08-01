import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBoxOpen,
  FaHeart,
  FaSignOutAlt
} from "react-icons/fa";

import "./Profile.css";

function Profile() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {

    const savedUser =
      localStorage.getItem("user");

    if (savedUser) {

      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("USER ERROR:", error);
        setUser(null);
      }

    }

  }, []);


  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };


  if (!user) {

    return (
      <div className="profile-login">

        <h1>Please Login</h1>

        <p>
          Login to view your profile.
        </p>

        <Link
          to="/login"
          className="profile-login-button"
        >
          Login
        </Link>

      </div>
    );

  }


  return (

    <div className="profile-page">

      <div className="profile-container">

        {/* PROFILE HEADER */}

        <div className="profile-header">

          <div className="profile-avatar">
            <FaUser />
          </div>

          <h1>
            {user.name || "HOMEKART User"}
          </h1>

          <p>
            Welcome to your HOMEKART account
          </p>

        </div>


        {/* USER DETAILS */}

        <div className="profile-details">

          <h2>
            Account Information
          </h2>


          <div className="profile-info">

            <div className="profile-info-item">

              <FaUser />

              <div>
                <span>Name</span>
                <strong>
                  {user.name || "Not available"}
                </strong>
              </div>

            </div>


            <div className="profile-info-item">

              <FaEnvelope />

              <div>
                <span>Email</span>
                <strong>
                  {user.email || "Not available"}
                </strong>
              </div>

            </div>


            <div className="profile-info-item">

              <FaPhone />

              <div>
                <span>Mobile</span>
                <strong>
                  {user.mobile || "Not available"}
                </strong>
              </div>

            </div>

          </div>

        </div>


        {/* QUICK LINKS */}

        <div className="profile-links">

          <h2>
            Quick Links
          </h2>


          <div className="profile-link-grid">

            <Link to="/order">

              <FaBoxOpen />

              <span>
                My Orders
              </span>

            </Link>


            <Link to="/wishlist">

              <FaHeart />

              <span>
                My Wishlist
              </span>

            </Link>


            <Link to="/cart">

              🛒

              <span>
                My Cart
              </span>

            </Link>


            <Link to="/products">

              🛍️

              <span>
                Shop Products
              </span>

            </Link>

          </div>

        </div>


        {/* LOGOUT */}

        <button
          className="profile-logout"
          onClick={handleLogout}
        >

          <FaSignOutAlt />

          Logout

        </button>

      </div>

    </div>

  );

}

export default Profile;
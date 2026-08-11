import "./Footer.css";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt
} from "react-icons/fa";

import { Link } from "react-router-dom";

function Footer() {

  const year = new Date().getFullYear();

  return (

    <footer className="footer">

      <div className="footer-container">

        {/* COMPANY */}

        <div className="footer-column">

          <h2>HOMEKART</h2>

          <p>

            HOMEKART is an online grocery store delivering premium spices,
            household essentials and quality products at affordable prices.

          </p>

          <div className="footer-social">

            <a href="#">
              <FaFacebookF />
            </a>

            <a href="#">
              <FaInstagram />
            </a>

            <a href="#">
              <FaTwitter />
            </a>

            <a href="#">
              <FaLinkedinIn />
            </a>

          </div>

        </div>

        {/* QUICK LINKS */}

        <div className="footer-column">

          <h3>Quick Links</h3>

          <Link to="/">Home</Link>

          <Link to="/products">Products</Link>

          <Link to="/categories">Categories</Link>

          <Link to="/wishlist">Wishlist</Link>

          <Link to="/cart">Cart</Link>

        </div>

        {/* CUSTOMER */}

        <div className="footer-column">

          <h3>Customer Service</h3>

          <Link to="/profile">My Account</Link>

          <Link to="/order">My Orders</Link>

          <Link to="/contact">Contact Us</Link>

          <Link to="/about">About Us</Link>

          <Link to="/faq">FAQ</Link>

        </div>

        {/* CONTACT */}

        <div className="footer-column">

          <h3>Contact</h3>

          <p>

            <FaPhoneAlt />

            +91 9959820059

          </p>

          <p>

            <FaEnvelope />

            johnsaida374@gmail.com

          </p>

          <p>

            <FaMapMarkerAlt />

            Guntur, Andhra Pradesh

          </p>

        </div>

      </div>

      <div className="footer-bottom">

        © {year} HOMEKART. All Rights Reserved.

      </div>

    </footer>

  );

}

export default Footer;
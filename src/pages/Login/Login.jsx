import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove error when user starts typing again
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Basic validation
    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }
      );

      console.log("LOGIN SUCCESS:", response.data);

      // Save JWT token
      if (response.data.token) {
        localStorage.setItem(
          "token",
          response.data.token
        );
      }

      // Save user information
      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      // Login successful
      navigate("/");

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      if (error.response) {
        setError(
          error.response.data?.message ||
          "Invalid email or password."
        );
      } else if (error.request) {
        setError(
          "Cannot connect to the server. Please make sure the backend is running."
        );
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* =========================
            LOGO
        ========================= */}

        <div className="auth-logo">
          🏠 HOMEKART
        </div>


        {/* =========================
            TITLE
        ========================= */}

        <h1>
          Login
        </h1>

        <p className="auth-subtitle">
          Welcome back! Please login to your account.
        </p>


        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* =========================
            LOGIN FORM
        ========================= */}

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

          </div>


          {/* FORGOT PASSWORD */}

          <div className="forgot-password">

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        {/* =========================
            REGISTER LINK
        ========================= */}

        <p className="auth-switch">

          Don't have an account?{" "}

          <Link to="/register">
            Create Account
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;
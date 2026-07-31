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
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/");

    } catch (error) {

      console.log(
        "LOGIN ERROR:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          🏠 HOMEKART
        </div>

        <h1>Login</h1>

        <p className="auth-subtitle">
          Welcome back! Please login to your account.
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

          </div>

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

          </div>

          <div className="forgot-password">
            <a href="#">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

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
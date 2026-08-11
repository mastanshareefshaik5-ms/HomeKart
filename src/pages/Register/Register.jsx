import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { saveAuth } from "../../utils/auth";
import "./Register.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert(
        "Name, email and password are required."
      );
      return;
    }

    if (
      form.phone &&
      !/^[0-9]{10}$/.test(form.phone)
    ) {
      alert(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (form.password.length < 6) {
      alert(
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      saveAuth(
        data.token,
        data.user
      );

      alert(
        "Account created successfully!"
      );

      navigate("/");

    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to register"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          🛒 HOMEKART
        </div>

        <h1>
          Create HOMEKART Account
        </h1>

        <p className="auth-subtitle">
          Create your account and start shopping.
        </p>

        <form onSubmit={handleSubmit}>

          {/* NAME */}

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>

          {/* EMAIL */}

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          {/* PHONE */}

          <div className="form-group">
            <label>Phone Number</label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter 10-digit phone number"
              value={form.phone}
              onChange={handleChange}
              maxLength="10"
              inputMode="numeric"
              autoComplete="tel"
            />
          </div>

          {/* PASSWORD */}

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          {/* BUTTON */}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* LOGIN */}

        <p className="auth-switch">
          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;
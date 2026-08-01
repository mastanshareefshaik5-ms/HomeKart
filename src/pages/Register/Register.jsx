import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  /* =========================
     HANDLE INPUT
  ========================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (message) {
      setMessage("");
    }
  };


  /* =========================
     REGISTER
  ========================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");


    /* NAME */

    if (formData.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }


    /* EMAIL */

    const email = formData.email
      .trim()
      .toLowerCase();

    if (!email) {
      setError("Please enter your email.");
      return;
    }


    /* MOBILE */

    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }


    /* PASSWORD */

    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }


    /* CONFIRM PASSWORD */

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }


    setLoading(true);


    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.name.trim(),
          email: email,
          mobile: formData.mobile,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }
      );


      console.log(
        "REGISTER SUCCESS:",
        response.data
      );


      setMessage(
        response.data?.message ||
        "Registration successful!"
      );


      /* CLEAR FORM */

      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
      });


      /* GO TO LOGIN */

      setTimeout(() => {
        navigate("/login");
      }, 1500);


    } catch (error) {

      console.error(
        "REGISTER ERROR:",
        error
      );

      console.log(
        "REGISTER ERROR RESPONSE:",
        error.response?.data
      );


      if (error.response) {

        setError(
          error.response.data?.message ||
          "Registration failed."
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
          Create Account
        </h1>

        <p className="auth-subtitle">
          Create your HOMEKART account
        </p>


        {/* =========================
            SUCCESS MESSAGE
        ========================= */}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}


        {/* =========================
            ERROR MESSAGE
        ========================= */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* =========================
            REGISTER FORM
        ========================= */}

        <form onSubmit={handleSubmit}>


          {/* FULL NAME */}

          <div className="form-group">

            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />

          </div>


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


          {/* MOBILE */}

          <div className="form-group">

            <label htmlFor="mobile">
              Mobile Number
            </label>

            <input
              id="mobile"
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              maxLength="10"
              inputMode="numeric"
              autoComplete="tel"
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
              placeholder="Create a password"
              autoComplete="new-password"
              required
            />

          </div>


          {/* CONFIRM PASSWORD */}

          <div className="form-group">

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
            />

          </div>


          {/* CREATE ACCOUNT */}

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


        {/* =========================
            LOGIN LINK
        ========================= */}

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
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

import "./Register.css";

function Register() {

  const navigate = useNavigate();

  const {
    register,
    loading
  } = useContext(AuthContext);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });


  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  const handleChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value,
    });
  };


  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setMessage("");


    if (
      formData.password !==
      formData.confirmPassword
    ) {

      setError(
        "Passwords do not match"
      );

      return;
    }


    const result = await register(
      formData.name,
      formData.email,
      formData.password
    );


    if (!result.success) {

      setError(result.message);

      return;
    }


    setMessage(
      "Registration successful! Redirecting to login..."
    );


    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };


  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          🏠 HOMEKART
        </div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Create your HOMEKART account
        </p>


        {message && (
          <div className="success-message">
            {message}
          </div>
        )}


        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />

          </div>


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

            <label>Mobile Number</label>

            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
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
              placeholder="Create a password"
              minLength="6"
              required
            />

          </div>


          <div className="form-group">

            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />

          </div>


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
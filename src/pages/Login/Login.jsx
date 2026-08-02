import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const {
    login,
    loading
  } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");

    const result = await login(
      email,
      password
    );

    if (!result.success) {

      setError(result.message);

      return;
    }

    // ADMIN
    if (result.user.role === "admin") {

      navigate("/admin");

      return;
    }

    // USER
    navigate("/");
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
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              required
            />

          </div>


          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              required
            />

          </div>


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
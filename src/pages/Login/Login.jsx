import {
  useState,
  useContext,
} from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import {
  AuthContext,
} from "../../context/AuthContext";

import "./Login.css";


function Login() {

  const navigate = useNavigate();

  const {
    login,
  } = useContext(AuthContext);


  const [form, setForm] = useState({
    email: "",
    password: "",
  });


  const [loading, setLoading] =
    useState(false);


  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {

    setForm({
      ...form,

      [e.target.name]:
        e.target.value,
    });
  };


  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (
      !form.email.trim() ||
      !form.password
    ) {

      alert(
        "Please enter email and password."
      );

      return;
    }


    try {

      setLoading(true);


      console.log(
        "LOGIN EMAIL:",
        form.email
      );


      const result =
        await login(
          form.email,
          form.password
        );


      console.log(
        "LOGIN RESULT:",
        result
      );


      // ----------------------------------------
      // LOGIN FAILED
      // ----------------------------------------

      if (!result.success) {

        alert(
          result.message ||
          "Login failed"
        );

        return;
      }


      // ----------------------------------------
      // VERIFY USER
      // ----------------------------------------

      console.log(
        "LOGGED-IN USER:",
        result.user
      );

      console.log(
        "LOGGED-IN NAME:",
        result.user?.name
      );

      console.log(
        "LOGGED-IN ROLE:",
        result.user?.role
      );


      if (!result.user) {

        alert(
          "User information was not received."
        );

        return;
      }


      alert(
        `Welcome ${result.user.name || "User"}!`
      );


      // ----------------------------------------
      // ADMIN
      // ----------------------------------------

      if (
        result.user.role === "admin"
      ) {

        navigate("/admin");

      }

      // ----------------------------------------
      // NORMAL CUSTOMER
      // ----------------------------------------

      else {

        navigate("/");
      }

    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      alert(
        error.message ||
        "Unable to login"
      );

    } finally {

      setLoading(false);
    }
  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="auth-page">

      <div className="auth-card">

        <h1>
          Login to HOMEKART
        </h1>


        <p className="auth-subtitle">
          Welcome back! Please login
          to continue.
        </p>


        <form
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />


          {/* PASSWORD */}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>


        <p className="auth-footer">

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
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Profile.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ======================================================
  // LOAD USER
  // ======================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      });

      setLoading(false);
    }
  }, [user, navigate]);

  // ======================================================
  // HANDLE INPUT
  // ======================================================

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  // ======================================================
  // SAVE PROFILE
  // ======================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/auth/profile`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: form.name.trim(),
            phone: form.phone.trim(),
          }),
        }
      );

      const data = await response.json();

      console.log("PROFILE UPDATE RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile"
        );
      }

      // Backend should return updated user
      const updatedUser = data.user || data;

      // Keep existing information such as role
      const finalUser = {
        ...user,
        ...updatedUser,
      };

      // Save updated user
      localStorage.setItem(
        "user",
        JSON.stringify(finalUser)
      );

      // Update AuthContext
      setUser(finalUser);

      // Update form
      setForm({
        name: finalUser.name || "",
        phone: finalUser.phone || "",
        email: finalUser.email || "",
      });

      alert("Profile updated successfully.");

    } catch (error) {
      console.error(
        "PROFILE UPDATE ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-loading">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // PROFILE UI
  // ======================================================

  return (
    <div className="profile-page">

      <div className="profile-card">

        {/* HEADER */}
        <div className="profile-header">

          <div className="profile-avatar">
            {form.name
              ? form.name
                  .charAt(0)
                  .toUpperCase()
              : "U"}
          </div>

          <div>
            <h1>Edit Profile</h1>

            <p>
              Update your HOMEKART account
              details.
            </p>
          </div>

        </div>

        {/* FORM */}
        <form
          className="profile-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}
          <div className="profile-field">

            <label htmlFor="name">
              Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />

          </div>

          {/* EMAIL */}
          <div className="profile-field">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              disabled
            />

            <small>
              Email cannot be changed here.
            </small>

          </div>

          {/* PHONE */}
          <div className="profile-field">

            <label htmlFor="phone">
              Phone
            </label>

            <input
              id="phone"
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />

          </div>

          {/* ROLE */}
          <div className="profile-role">

            <span>
              Account Type
            </span>

            <strong>
              {user?.role === "admin"
                ? "Administrator"
                : "Customer"}
            </strong>

          </div>

          {/* BUTTONS */}
          <div className="profile-actions">

            <button
              type="button"
              className="profile-cancel-btn"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="profile-save-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Profile;
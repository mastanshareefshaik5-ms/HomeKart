import { useEffect, useState } from "react";
import "./AdminUsers.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login again");
      }

      const response = await fetch(
        `${API_URL}/api/users`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("ADMIN USERS RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch users"
        );
      }

      if (Array.isArray(data.users)) {
        setUsers(data.users);
      } else if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error(
        "ADMIN USERS ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to load users"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);


  const handleDelete = async (userId) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(userId);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete user"
        );
      }

      setUsers((previous) =>
        previous.filter(
          (user) =>
            user._id !== userId
        )
      );

      alert(
        "User deleted successfully"
      );
    } catch (error) {
      console.error(
        "DELETE USER ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to delete user"
      );
    } finally {
      setDeletingId(null);
    }
  };


  if (loading) {
    return (
      <div className="admin-users-page">

        <div className="admin-users-loading">
          Loading users...
        </div>

      </div>
    );
  }


  return (
    <div className="admin-users-page">

      {/* =====================================
          USERS HEADER
      ====================================== */}

      <div className="admin-users-header">

        <div>
          <h1>
            Manage Users
          </h1>

          <p>
            View registered HOMEKART
            customers.
          </p>
        </div>

        <button
          type="button"
          className="admin-users-refresh"
          onClick={fetchUsers}
        >
          ↻ Refresh
        </button>

      </div>


      {/* =====================================
          USERS
      ====================================== */}

      {users.length === 0 ? (

        <div className="admin-users-empty">

          <div className="admin-users-empty-icon">
            👥
          </div>

          <h2>
            No Users Found
          </h2>

          <p>
            Registered customers will
            appear here.
          </p>

        </div>

      ) : (

        <div className="admin-users-table-wrapper">

          <table className="admin-users-table">

            <thead>

              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>

            </thead>


            <tbody>

              {users.map((user) => (

                <tr key={user._id}>

                  <td>
                    {user.name ||
                      "Customer"}
                  </td>

                  <td>
                    {user.email ||
                      "-"}
                  </td>

                  <td>
                    {user.phone ||
                      "-"}
                  </td>

                  <td>

                    <span
                      className={
                        user.role === "admin"
                          ? "user-role admin"
                          : "user-role customer"
                      }
                    >
                      {user.role ||
                        "customer"}
                    </span>

                  </td>

                  <td>
                    {user.createdAt
                      ? new Date(
                          user.createdAt
                        ).toLocaleDateString(
                          "en-IN"
                        )
                      : "-"}
                  </td>

                  <td>

                    {user.role === "admin" ? (

                      <span className="admin-user-label">
                        Admin
                      </span>

                    ) : (

                      <button
                        type="button"
                        className="delete-user-btn"
                        disabled={
                          deletingId ===
                          user._id
                        }
                        onClick={() =>
                          handleDelete(
                            user._id
                          )
                        }
                      >
                        {deletingId ===
                        user._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default AdminUsers;
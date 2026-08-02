import React, { useEffect, useState } from "react";
import "./AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken")
    );
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        "http://localhost:5000/api/auth/users",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch users"
        );
      }

      setUsers(
        Array.isArray(data)
          ? data
          : data.users || []
      );

    } catch (error) {
      console.error("Users error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-users">

      <div className="admin-users-header">

        <div>
          <h1>Manage Users</h1>
          <p>
            View registered HOMEKART customers.
          </p>
        </div>

        <button
          className="refresh-users-btn"
          onClick={fetchUsers}
        >
          🔄 Refresh
        </button>

      </div>

      {loading && (
        <div className="admin-users-message">
          Loading users...
        </div>
      )}

      {!loading && error && (
        <div className="admin-users-error">
          <h3>Unable to load users</h3>

          <p>{error}</p>

          <button onClick={fetchUsers}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="admin-users-message">
          No users found.
        </div>
      )}

      {!loading && !error && users.length > 0 && (

        <div className="users-table-container">

          <table className="users-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>

            <tbody>

              {users.map((user, index) => (

                <tr key={user._id}>

                  <td>
                    {index + 1}
                  </td>

                  <td>
                    {user.name || "N/A"}
                  </td>

                  <td>
                    {user.email || "N/A"}
                  </td>

                  <td>
                    <span
                      className={
                        user.role === "admin"
                          ? "role-admin"
                          : "role-user"
                      }
                    >
                      {user.role || "user"}
                    </span>
                  </td>

                  <td>
                    {user.createdAt
                      ? new Date(
                          user.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
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
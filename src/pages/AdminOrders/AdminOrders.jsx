import React, { useEffect, useState } from "react";
import "./AdminOrders.css";

function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken")
    );
  };


  const fetchOrders = async () => {

    try {

      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        "http://localhost:5000/api/orders/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(
        Array.isArray(data)
          ? data
          : data.orders || []
      );

    } catch (error) {

      console.error("Orders error:", error);

      setError(error.message);

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {
    fetchOrders();
  }, []);


  // UPDATE STATUS
  const updateStatus = async (id, status) => {

    try {

      const token = getToken();

      const response = await fetch(
        `http://localhost:5000/api/orders/${id}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            status
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order"
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === id
            ? {
                ...order,
                status
              }
            : order
        )
      );

    } catch (error) {

      console.error(
        "Update status error:",
        error
      );

      alert(error.message);

    }

  };


  // DELETE ORDER
  const deleteOrder = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) {
      return;
    }

    try {

      const token = getToken();

      const response = await fetch(
        `http://localhost:5000/api/orders/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete order"
        );
      }

      setOrders((currentOrders) =>
        currentOrders.filter(
          (order) => order._id !== id
        )
      );

      alert("Order deleted successfully!");

    } catch (error) {

      console.error(
        "Delete order error:",
        error
      );

      alert(error.message);

    }

  };


  return (

    <div className="admin-orders">

      <div className="admin-orders-header">

        <div>

          <h1>Manage Orders</h1>

          <p>
            View and manage all HOMEKART customer orders.
          </p>

        </div>


        <button
          className="refresh-orders-btn"
          onClick={fetchOrders}
        >
          🔄 Refresh
        </button>

      </div>


      {loading && (

        <div className="admin-orders-message">
          Loading orders...
        </div>

      )}


      {!loading && error && (

        <div className="admin-orders-error">

          <h3>
            Unable to load orders
          </h3>

          <p>
            {error}
          </p>

          <button onClick={fetchOrders}>
            Try Again
          </button>

        </div>

      )}


      {!loading &&
        !error &&
        orders.length === 0 && (

          <div className="admin-orders-message">

            <h3>
              No orders found
            </h3>

            <p>
              Customer orders will appear here
              after an order is placed.
            </p>

          </div>

      )}


      {!loading &&
        !error &&
        orders.length > 0 && (

          <div className="orders-table-container">

            <table className="orders-table">

              <thead>

                <tr>

                  <th>Order ID</th>

                  <th>Customer</th>

                  <th>Email</th>

                  <th>Total</th>

                  <th>Status</th>

                  <th>Date</th>

                  <th>Actions</th>

                </tr>

              </thead>


              <tbody>

                {orders.map((order) => (

                  <tr key={order._id}>

                    <td>
                      #{order._id?.slice(-6)}
                    </td>


                    <td>
                      {order.user?.name || "Customer"}
                    </td>


                    <td>
                      {order.user?.email || "N/A"}
                    </td>


                    <td>
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toFixed(2)}
                    </td>


                    <td>

                      <select
                        value={
                          order.status || "Pending"
                        }
                        onChange={(e) =>
                          updateStatus(
                            order._id,
                            e.target.value
                          )
                        }
                        className="order-status-select"
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Processing">
                          Processing
                        </option>

                        <option value="Shipped">
                          Shipped
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>

                      </select>

                    </td>


                    <td>

                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString()
                        : "N/A"}

                    </td>


                    <td>

                      <button
                        className="delete-order-btn"
                        onClick={() =>
                          deleteOrder(order._id)
                        }
                      >
                        Delete
                      </button>

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

export default AdminOrders;
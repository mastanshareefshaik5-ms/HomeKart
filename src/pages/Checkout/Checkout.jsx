import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    clearCart
  } = useContext(CartContext);

  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "Cash on Delivery"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // DELIVERY CHARGE
  const deliveryCharge =
    Number(cartTotal) >= 500 || Number(cartTotal) === 0
      ? 0
      : 40;

  // FINAL TOTAL
  const finalTotal =
    Number(cartTotal) + Number(deliveryCharge);

  // HANDLE INPUT
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // PLACE ORDER
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // CHECK CART
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    // CHECK LOGIN
    if (!user) {
      setError("Please login before placing an order.");
      return;
    }

    // CHECK MOBILE
    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    // CHECK PINCODE
    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      setError(
        "Please enter a valid 6-digit pincode."
      );
      return;
    }

    setLoading(true);

    try {
      /*
       * CREATE ORDER ITEMS
       *
       * This format matches Backend/models/Order.js
       */

      const items = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image || ""
      }));

      /*
       * CREATE FULL ADDRESS
       */

      const fullAddress = [
        formData.name,
        formData.address,
        formData.city,
        formData.state,
        formData.pincode
      ]
        .filter(Boolean)
        .join(", ");

      /*
       * DATA SENT TO BACKEND
       */

      const orderData = {
        items: items,
        totalAmount: Number(finalTotal),
        address: fullAddress,
        phone: formData.mobile
      };

      console.log(
        "Sending order:",
        orderData
      );

      /*
       * GET LOGIN TOKEN
       */

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError(
          "Login session expired. Please login again."
        );

        setLoading(false);
        return;
      }

      /*
       * SEND ORDER TO BACKEND
       */

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify(orderData)
        }
      );

      /*
       * READ BACKEND RESPONSE
       */

      const data = await response.json();

      console.log(
        "Order response:",
        data
      );

      /*
       * CHECK RESPONSE
       */

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to create order"
        );
      }

      /*
       * SAVE LATEST ORDER
       *
       * Used by Order page.
       */

      localStorage.setItem(
        "latestOrder",
        JSON.stringify(data.order)
      );

      /*
       * CLEAR CART
       */

      clearCart();

      /*
       * GO TO ORDER PAGE
       */

      navigate("/order");

    } catch (error) {

      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      setError(
        error.message ||
        "Something went wrong while placing the order."
      );

    } finally {

      setLoading(false);

    }
  };

  /*
   * EMPTY CART
   */

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">

        <h1>
          Your Cart is Empty
        </h1>

        <p>
          Please add products before checkout.
        </p>

        <button
          onClick={() =>
            navigate("/products")
          }
        >
          Continue Shopping
        </button>

      </div>
    );
  }

  return (
    <div className="checkout-page">

      <h1>
        Checkout
      </h1>

      <div className="checkout-layout">

        {/* =========================
            CUSTOMER DETAILS
        ========================= */}

        <div className="checkout-form-container">

          <h2>
            Delivery Address
          </h2>

          {/* ERROR */}

          {error && (
            <div className="checkout-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* FULL NAME */}

            <div className="checkout-field">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

            </div>

            {/* MOBILE */}

            <div className="checkout-field">

              <label>
                Mobile Number
              </label>

              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                maxLength="10"
                inputMode="numeric"
                required
              />

            </div>

            {/* ADDRESS */}

            <div className="checkout-field">

              <label>
                Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House number, street, area"
                rows="4"
                required
              />

            </div>

            {/* CITY + STATE */}

            <div className="checkout-row">

              <div className="checkout-field">

                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />

              </div>

              <div className="checkout-field">

                <label>
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  required
                />

              </div>

            </div>

            {/* PINCODE */}

            <div className="checkout-field">

              <label>
                Pincode
              </label>

              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                maxLength="6"
                inputMode="numeric"
                required
              />

            </div>

            {/* =========================
                PAYMENT
            ========================= */}

            <h2 className="payment-title">
              Payment Method
            </h2>

            <div className="payment-options">

              {/* CASH ON DELIVERY */}

              <label>

                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={
                    formData.paymentMethod ===
                    "Cash on Delivery"
                  }
                  onChange={handleChange}
                />

                Cash on Delivery

              </label>

              {/* ONLINE PAYMENT */}

              <label>

                <input
                  type="radio"
                  name="paymentMethod"
                  value="Online Payment"
                  checked={
                    formData.paymentMethod ===
                    "Online Payment"
                  }
                  onChange={handleChange}
                />

                Online Payment

              </label>

            </div>

            {/* PLACE ORDER */}

            <button
              type="submit"
              className="place-order-button"
              disabled={loading}
            >

              {loading
                ? "Placing Order..."
                : "Place Order"}

            </button>

          </form>

        </div>

        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <div className="checkout-summary">

          <h2>
            Order Summary
          </h2>

          {/* PRODUCTS */}

          <div className="checkout-items">

            {cartItems.map((item) => (

              <div
                className="checkout-item"
                key={item._id}
              >

                <div>

                  <strong>
                    {item.name}
                  </strong>

                  <p>
                    Qty: {item.quantity}
                  </p>

                </div>

                <strong>
                  ₹
                  {Number(item.price) *
                    Number(item.quantity)}
                </strong>

              </div>

            ))}

          </div>

          <hr />

          {/* SUBTOTAL */}

          <div className="checkout-summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              ₹{cartTotal}
            </strong>

          </div>

          {/* DELIVERY */}

          <div className="checkout-summary-row">

            <span>
              Delivery
            </span>

            <strong>

              {deliveryCharge === 0
                ? "FREE"
                : `₹${deliveryCharge}`}

            </strong>

          </div>

          <hr />

          {/* TOTAL */}

          <div className="checkout-total">

            <span>
              Total
            </span>

            <strong>
              ₹{finalTotal}
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;
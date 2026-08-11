import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

import "./Checkout.css";

const API_URL =
  import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL}/api/auth/login`;

function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // IMPORTANT:
  // Backend enum should receive COD or RAZORPAY
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // =====================================================
  // CART
  // =====================================================

  const items = Array.isArray(cartItems) ? cartItems : [];

  // =====================================================
  // CALCULATE SUBTOTAL
  // =====================================================

  const totalPrice = items.reduce((total, item) => {
    const price = Number(
      item.finalPrice ?? item.price ?? 0
    );

    const quantity = Number(item.quantity || 1);

    return total + price * quantity;
  }, 0);

  // =====================================================
  // DELIVERY
  // =====================================================

  const deliveryCharge =
    totalPrice === 0
      ? 0
      : totalPrice >= 500
      ? 0
      : 40;

  const finalTotal = totalPrice + deliveryCharge;

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setAddress((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // LOAD RAZORPAY
  // =====================================================

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  // =====================================================
  // CREATE BACKEND ORDER
  // =====================================================

  const createBackendOrder = async (token) => {
    /*
      IMPORTANT:

      Each item now contains:

      product
      name
      price
      quantity
      subtotal
      image

      This fixes:
      "items.0.subtotal: Path subtotal is required"
    */

    const orderData = {
      items: items.map((item) => {
        const price = Number(
          item.finalPrice ?? item.price ?? 0
        );

        const quantity = Number(
          item.quantity || 1
        );

        const subtotal = price * quantity;

        return {
          product: item._id,

          name: item.name,

          price: price,

          quantity: quantity,

          subtotal: subtotal,

          image: item.image || "",
        };
      }),

      totalAmount: finalTotal,

      address: {
        name: address.name,
        phone: address.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      },

      phone: address.phone,

      /*
        IMPORTANT:

        Send:
        COD

        OR:

        RAZORPAY

        NOT:
        "Cash on Delivery"
        "Online Payment"
      */

      paymentMethod: paymentMethod,
    };

    console.log(
      "ORDER DATA SENT TO BACKEND:",
      orderData
    );

    const response = await fetch(
      `${API_URL}/api/orders`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(orderData),
      }
    );

    const data = await response.json();

    console.log(
      "BACKEND ORDER RESPONSE:",
      data
    );

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to create order"
      );
    }

    return data.order;
  };

  // =====================================================
  // RAZORPAY PAYMENT
  // =====================================================

  const handleRazorpayPayment = async (
    token,
    backendOrder
  ) => {
    const loaded = await loadRazorpay();

    if (!loaded) {
      throw new Error(
        "Razorpay failed to load. Please check your internet connection."
      );
    }

    // ===================================================
    // CREATE RAZORPAY ORDER
    // ===================================================

    const response = await fetch(
      `${API_URL}/api/payment/create-order`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          orderId: backendOrder._id,
        }),
      }
    );

    const data = await response.json();

    console.log(
      "RAZORPAY ORDER RESPONSE:",
      data
    );

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to start payment"
      );
    }

    // ===================================================
    // OPEN RAZORPAY
    // ===================================================

    return new Promise((resolve, reject) => {
      const options = {
        key: data.key,

        amount: data.amount,

        currency: data.currency || "INR",

        name: "HOMEKART",

        description:
          "HOMEKART Order Payment",

        order_id:
          data.razorpayOrderId,

        prefill: {
          name:
            address.name ||
            user?.name ||
            "",

          email:
            user?.email ||
            "",

          contact:
            address.phone ||
            "",
        },

        theme: {
          color: "#ff6b00",
        },

        handler: async function (
          paymentResponse
        ) {
          try {
            console.log(
              "RAZORPAY PAYMENT:",
              paymentResponse
            );

            // =========================================
            // VERIFY PAYMENT
            // =========================================

            const verifyResponse =
              await fetch(
                `${API_URL}/api/payment/verify`,
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json",

                    Authorization:
                      `Bearer ${token}`,
                  },

                  body: JSON.stringify(
                    paymentResponse
                  ),
                }
              );

            const verifyData =
              await verifyResponse.json();

            console.log(
              "PAYMENT VERIFY RESPONSE:",
              verifyData
            );

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.message ||
                  "Payment verification failed"
              );
            }

            resolve(true);
          } catch (error) {
            reject(error);
          }
        },

        modal: {
          ondismiss: function () {
            reject(
              new Error(
                "Payment was cancelled."
              )
            );
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "RAZORPAY PAYMENT FAILED:",
            response
          );

          reject(
            new Error(
              "Payment failed. Please try again."
            )
          );
        }
      );

      razorpay.open();
    });
  };

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // ===================================================
    // TOKEN
    // ===================================================

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert(
        "Please login before placing your order."
      );

      navigate("/login");

      return;
    }

    // ===================================================
    // CART
    // ===================================================

    if (items.length === 0) {
      alert(
        "Your cart is empty."
      );

      navigate("/products");

      return;
    }

    // ===================================================
    // ADDRESS VALIDATION
    // ===================================================

    if (
      !address.name.trim() ||
      !address.phone.trim() ||
      !address.address.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.pincode.trim()
    ) {
      alert(
        "Please fill all delivery address details."
      );

      return;
    }

    // ===================================================
    // PHONE VALIDATION
    // ===================================================

    if (
      !/^[0-9]{10}$/.test(
        address.phone
      )
    ) {
      alert(
        "Please enter a valid 10-digit phone number."
      );

      return;
    }

    // ===================================================
    // PINCODE VALIDATION
    // ===================================================

    if (
      !/^[0-9]{6}$/.test(
        address.pincode
      )
    ) {
      alert(
        "Please enter a valid 6-digit pincode."
      );

      return;
    }

    try {
      setLoading(true);

      // =================================================
      // CREATE HOMEKART ORDER
      // =================================================

      const backendOrder =
        await createBackendOrder(
          token
        );

      console.log(
        "HOMEKART ORDER CREATED:",
        backendOrder
      );

      // =================================================
      // COD
      // =================================================

      if (
        paymentMethod === "COD"
      ) {
        alert(
          "Order placed successfully!"
        );

        if (clearCart) {
          clearCart();
        } else {
          localStorage.removeItem(
            "homekart-cart"
          );
        }

        navigate("/order");

        return;
      }

      // =================================================
      // RAZORPAY
      // =================================================

      if (
        paymentMethod ===
        "RAZORPAY"
      ) {
        await handleRazorpayPayment(
          token,
          backendOrder
        );

        alert(
          "Payment successful! Order placed successfully."
        );

        if (clearCart) {
          clearCart();
        } else {
          localStorage.removeItem(
            "homekart-cart"
          );
        }

        navigate("/order");

        return;
      }
    } catch (error) {
      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to place order."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h1>
            Your Cart is Empty
          </h1>

          <p>
            Please add products before
            proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="continue-shopping"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="checkout-page">

      <div className="checkout-container">

        {/* =========================================
            LEFT SIDE
        ========================================== */}

        <form
          className="checkout-left"
          onSubmit={handleSubmit}
        >

          <h2>
            Delivery Address
          </h2>

          {/* NAME */}

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={address.name}
            onChange={handleChange}
          />

          {/* PHONE */}

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={address.phone}
            onChange={handleChange}
            maxLength={10}
          />

          {/* ADDRESS */}

          <textarea
            name="address"
            placeholder="Full Address"
            rows={4}
            value={address.address}
            onChange={handleChange}
          />

          {/* CITY */}

          <input
            type="text"
            name="city"
            placeholder="City"
            value={address.city}
            onChange={handleChange}
          />

          {/* STATE */}

          <input
            type="text"
            name="state"
            placeholder="State"
            value={address.state}
            onChange={handleChange}
          />

          {/* PINCODE */}

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={address.pincode}
            onChange={handleChange}
            maxLength={6}
          />

          {/* =====================================
              PAYMENT
          ====================================== */}

          <h2>
            Payment Method
          </h2>

          {/* COD */}

          <label className="payment-option">

            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={
                paymentMethod === "COD"
              }
              onChange={(event) =>
                setPaymentMethod(
                  event.target.value
                )
              }
            />

            <div>
              <strong>
                Cash on Delivery
              </strong>

              <p>
                Pay when your order
                is delivered.
              </p>
            </div>

          </label>

          {/* RAZORPAY */}

          <label className="payment-option">

            <input
              type="radio"
              name="paymentMethod"
              value="RAZORPAY"
              checked={
                paymentMethod ===
                "RAZORPAY"
              }
              onChange={(event) =>
                setPaymentMethod(
                  event.target.value
                )
              }
            />

            <div>
              <strong>
                Online Payment
              </strong>

              <p>
                Pay securely using
                Razorpay.
              </p>
            </div>

          </label>

          {/* =====================================
              PLACE ORDER BUTTON
          ====================================== */}

          <button
            type="submit"
            className="place-order-btn"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : paymentMethod ===
                "RAZORPAY"
              ? `Pay ₹${finalTotal.toLocaleString(
                  "en-IN"
                )}`
              : `Place Order • ₹${finalTotal.toLocaleString(
                  "en-IN"
                )}`}
          </button>

        </form>

        {/* =========================================
            RIGHT SIDE
        ========================================== */}

        <div className="checkout-right">

          <h2>
            Order Summary
          </h2>

          {/* PRODUCTS */}

          {items.map(
            (item, index) => {
              const price =
                Number(
                  item.finalPrice ??
                    item.price ??
                    0
                );

              const quantity =
                Number(
                  item.quantity || 1
                );

              const itemTotal =
                price * quantity;

              return (
                <div
                  className="summary-item"
                  key={
                    item._id ||
                    index
                  }
                >

                  <img
                    src={
                      item.image ||
                      "https://via.placeholder.com/80"
                    }
                    alt={
                      item.name
                    }
                  />

                  <div>
                    <h4>
                      {item.name}
                    </h4>

                    <p>
                      ₹
                      {price.toLocaleString(
                        "en-IN"
                      )}{" "}
                      × {quantity}
                    </p>
                  </div>

                  <span>
                    ₹
                    {itemTotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>
              );
            }
          )}

          <hr />

          {/* SUBTOTAL */}

          <div className="price-row">

            <span>
              Subtotal
            </span>

            <strong>
              ₹
              {totalPrice.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          {/* DELIVERY */}

          <div className="price-row">

            <span>
              Delivery
            </span>

            <strong>
              {deliveryCharge === 0
                ? "FREE"
                : `₹${deliveryCharge}`}
            </strong>

          </div>

          {/* FREE DELIVERY MESSAGE */}

          {totalPrice > 0 &&
            totalPrice < 500 && (
              <p className="free-delivery-message">
                Add ₹
                {(
                  500 - totalPrice
                ).toLocaleString(
                  "en-IN"
                )}{" "}
                more for FREE
                delivery.
              </p>
            )}

          {/* TOTAL */}

          <div className="price-row total">

            <span>
              Total
            </span>

            <strong>
              ₹
              {finalTotal.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;
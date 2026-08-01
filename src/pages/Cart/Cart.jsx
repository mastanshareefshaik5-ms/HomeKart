import { useContext } from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

import { CartContext } from "../../context/CartContext";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);

  // Calculate subtotal safely
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total +
      (Number(item.price) || 0) *
        (Number(item.quantity) || 0),
    0
  );

  // Delivery charge
  const deliveryCharge =
    totalPrice >= 500 || totalPrice === 0
      ? 0
      : 40;

  // Final total
  const finalTotal =
    totalPrice + deliveryCharge;

  // Total number of products
  const totalItems = cartItems.reduce(
    (total, item) =>
      total + (Number(item.quantity) || 0),
    0
  );

  // =========================
  // EMPTY CART
  // =========================

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">

        <div className="empty-cart-icon">
          🛒
        </div>

        <h2>
          Your Cart is Empty
        </h2>

        <p>
          Add some household products
          to your cart.
        </p>

        <Link
          to="/products"
          className="continue-shopping"
        >
          Continue Shopping
        </Link>

      </div>
    );
  }

  // =========================
  // CART PAGE
  // =========================

  return (
    <div className="cart-page">

      <div className="cart-container">

        {/* =====================
            CART PRODUCTS
        ====================== */}

        <div className="cart-products">

          <h2>
            Shopping Cart
          </h2>

          {cartItems.map((item) => (

            <div
              className="cart-item"
              key={item._id}
            >

              {/* PRODUCT IMAGE */}

              <div className="cart-product-image">

                {item.image ? (

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                ) : (

                  <span>
                    {item.icon || "🛒"}
                  </span>

                )}

              </div>


              {/* PRODUCT DETAILS */}

              <div className="cart-product-details">

                <h3>
                  {item.name}
                </h3>

                <p>
                  {item.description}
                </p>

                <strong>
                  ₹{Number(item.price) || 0}
                </strong>


                {/* QUANTITY CONTROLS */}

                <div className="quantity-controls">

                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(item._id)
                    }
                  >
                    −
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      increaseQuantity(item._id)
                    }
                  >
                    +
                  </button>

                </div>

              </div>


              {/* RIGHT SIDE */}

              <div className="cart-item-right">

                <h3>
                  ₹
                  {(Number(item.price) || 0) *
                    (Number(item.quantity) || 0)}
                </h3>

                <button
                  type="button"
                  className="remove-button"
                  onClick={() =>
                    removeFromCart(item._id)
                  }
                >

                  <FaTrash />

                  Remove

                </button>

              </div>

            </div>

          ))}

        </div>


        {/* =====================
            ORDER SUMMARY
        ====================== */}

        <div className="cart-summary">

          <h2>
            Order Summary
          </h2>


          {/* ITEMS */}

          <div className="summary-row">

            <span>
              Items
            </span>

            <span>
              {totalItems}
            </span>

          </div>


          {/* SUBTOTAL */}

          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <span>
              ₹{totalPrice}
            </span>

          </div>


          {/* DELIVERY */}

          <div className="summary-row">

            <span>
              Delivery
            </span>

            <span>

              {deliveryCharge === 0
                ? "FREE"
                : `₹${deliveryCharge}`}

            </span>

          </div>


          {/* FREE DELIVERY MESSAGE */}

          {totalPrice < 500 && (

            <p className="free-delivery-message">

              Add ₹{500 - totalPrice} more
              for FREE delivery.

            </p>

          )}


          <hr />


          {/* FINAL TOTAL */}

          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹{finalTotal}
            </strong>

          </div>


          {/* CHECKOUT */}

          <Link
            to="/checkout"
            className="checkout-button"
          >
            Proceed to Checkout
          </Link>


          {/* CONTINUE SHOPPING */}

          <Link
            to="/products"
            className="continue-shopping-small"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Cart;
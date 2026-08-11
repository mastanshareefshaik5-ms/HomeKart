import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useContext(CartContext);

  const items = Array.isArray(cartItems) ? cartItems : [];

  // ==============================
  // TOTAL PRICE
  // ==============================

  const totalPrice = items.reduce((total, item) => {
    const price = Number(
      item.finalPrice ?? item.price ?? 0
    );

    const quantity = Number(
      item.quantity || 1
    );

    return total + price * quantity;
  }, 0);

  // ==============================
  // DELIVERY
  // ==============================

  const deliveryCharge =
    totalPrice === 0
      ? 0
      : totalPrice >= 500
      ? 0
      : 40;

  // ==============================
  // FINAL TOTAL
  // ==============================

  const finalTotal =
    totalPrice + deliveryCharge;

  // ==============================
  // EMPTY CART
  // ==============================

  if (items.length === 0) {
    return (
      <div className="empty-cart">

        <div className="empty-cart-icon">
          🛒
        </div>

        <h1>
          Your Cart is Empty
        </h1>

        <p>
          Add some HOMEKART products
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

  // ==============================
  // CART
  // ==============================

  return (
    <div className="cart-page">

      <div className="cart-container">

        {/* =================================
            LEFT SIDE - CART PRODUCTS
        ================================= */}

        <div className="cart-products">

          <div className="cart-header">

            <h1>
              Shopping Cart
            </h1>

            <span>
              {items.length}{" "}
              {items.length === 1
                ? "item"
                : "items"}
            </span>

          </div>

          {/* CART ITEMS */}

          {items.map((item, index) => {

            const price = Number(
              item.finalPrice ??
              item.price ??
              0
            );

            const quantity = Number(
              item.quantity || 1
            );

            const itemTotal =
              price * quantity;

            return (
              <div
                className="cart-item"
                key={
                  item._id ||
                  item.product ||
                  index
                }
              >

                {/* PRODUCT IMAGE */}

                <div className="cart-product-image">

                  <img
                    src={
                      item.image ||
                      "https://via.placeholder.com/150"
                    }
                    alt={
                      item.name ||
                      "Product"
                    }
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://via.placeholder.com/150";
                    }}
                  />

                </div>

                {/* PRODUCT DETAILS */}

                <div className="cart-product-details">

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    {item.brand ||
                      "HOMEKART"}
                  </p>

                  <strong>
                    ₹
                    {price.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  {/* QUANTITY */}

                  <div className="quantity-controls">

                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(
                          item._id
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(
                          item._id
                        )
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
                    {itemTotal.toLocaleString(
                      "en-IN"
                    )}
                  </h3>

                  <button
                    type="button"
                    className="remove-button"
                    onClick={() =>
                      removeFromCart(
                        item._id
                      )
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>
            );
          })}

        </div>

        {/* =================================
            RIGHT SIDE - ORDER SUMMARY
        ================================= */}

        <div className="cart-summary">

          <h2>
            Order Summary
          </h2>

          {/* SUBTOTAL */}

          <div className="summary-row">

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

          <div className="summary-row">

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
                {(500 - totalPrice).toLocaleString(
                  "en-IN"
                )}{" "}
                more for FREE
                delivery.

              </p>
            )}

          <div className="summary-divider" />

          {/* FINAL TOTAL */}

          <div className="summary-total">

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
            ← Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Cart;
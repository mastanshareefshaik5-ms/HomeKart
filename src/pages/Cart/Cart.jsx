import { useContext } from "react";
import { FaTrash } from "react-icons/fa";
import { CartContext } from "../../context/CartContext";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your Cart is Empty</h2>
        <p>Add some household products to your cart.</p>
      </div>
    );
  }

  return (
    <div className="cart-page">

      <div className="cart-container">

        <div className="cart-products">

          <h2>Shopping Cart</h2>

          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>

              <div className="cart-product-image">
                {item.icon}
              </div>

              <div className="cart-product-details">

                <h3>{item.name}</h3>

                <p>{item.description}</p>

                <strong>₹{item.price}</strong>

                <div className="quantity-controls">

                  <button
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => increaseQuantity(item.id)}
                  >
                    +
                  </button>

                </div>

              </div>

              <div className="cart-item-right">

                <h3>
                  ₹{item.price * item.quantity}
                </h3>

                <button
                  className="remove-button"
                  onClick={() => removeFromCart(item.id)}
                >
                  <FaTrash />
                  Remove
                </button>

              </div>

            </div>
          ))}

        </div>

        <div className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items</span>
            <span>
              {cartItems.reduce(
                (total, item) => total + item.quantity,
                0
              )}
            </span>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span>FREE</span>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{totalPrice}</strong>
          </div>

          <button className="checkout-button">
            Proceed to Checkout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Cart;
import { Link } from "react-router-dom";
import "./OrderSuccess.css";

function OrderSuccess() {
  const order = JSON.parse(
    localStorage.getItem("latestOrder")
  );

  return (
    <div className="order-success-page">

      <div className="order-success-card">

        <div className="success-icon">
          ✓
        </div>

        <h1>
          Order Placed Successfully!
        </h1>

        <p className="success-message">
          Thank you for shopping with HOMEKART.
          Your order has been received successfully.
        </p>

        {order && (
          <div className="success-order-info">

            <div>
              <span>Order ID</span>
              <strong>{order.orderId}</strong>
            </div>

            <div>
              <span>Total Amount</span>
              <strong>₹{order.total}</strong>
            </div>

            <div>
              <span>Payment</span>
              <strong>
                {order.customer.paymentMethod}
              </strong>
            </div>

          </div>
        )}

        <p className="delivery-message">
          📦 Your order will be processed soon.
        </p>

        <div className="success-actions">

          <Link
            to="/order"
            className="view-order-button"
          >
            View Order
          </Link>

          <Link
            to="/products"
            className="continue-shopping-button"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
}

export default OrderSuccess;
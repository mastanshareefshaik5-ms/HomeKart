import { Link } from "react-router-dom";
import "./Order.css";

function Order() {
  const order = JSON.parse(localStorage.getItem("latestOrder"));

  if (!order) {
    return (
      <div className="order-empty">
        <div className="order-empty-icon">📦</div>

        <h1>No Orders Found</h1>

        <p>You have not placed any orders yet.</p>

        <Link to="/products" className="order-shop-button">
          Start Shopping
        </Link>
      </div>
    );
  }

  // Calculate values safely
  const subtotal = Number(order.subtotal) || 0;
  const deliveryCharge = Number(order.deliveryCharge) || 0;

  // Always calculate total correctly
  const total = subtotal + deliveryCharge;

  return (
    <div className="order-page">

      <div className="order-container">

        {/* =========================
            ORDER HEADER
        ========================= */}

        <div className="order-header">

          <div className="order-success-icon">
            ✓
          </div>

          <h1>
            Order Details
          </h1>

          <p>
            Your order has been placed successfully.
          </p>

        </div>


        {/* =========================
            ORDER INFORMATION
        ========================= */}

        <div className="order-info">

          <div>
            <span>Order ID</span>

            <strong>
              {order.orderId}
            </strong>
          </div>


          <div>
            <span>Order Date</span>

            <strong>
              {new Date(
                order.orderDate
              ).toLocaleDateString()}
            </strong>
          </div>


          <div>
            <span>Payment Method</span>

            <strong>
              {order.customer?.paymentMethod ||
                "Cash on Delivery"}
            </strong>
          </div>


          <div>
            <span>Delivery Status</span>

            <strong className="order-status">
              {order.status || "Order Placed"}
            </strong>
          </div>

        </div>


        {/* =========================
            DELIVERY ADDRESS
        ========================= */}

        <div className="order-section">

          <h2>
            Delivery Address
          </h2>

          <div className="address-box">

            <strong>
              {order.customer?.name}
            </strong>

            <p>
              {order.customer?.mobile}
            </p>

            <p>
              {order.customer?.address}
            </p>

            <p>
              {order.customer?.city},{" "}
              {order.customer?.state} -{" "}
              {order.customer?.pincode}
            </p>

          </div>

        </div>


        {/* =========================
            ORDERED PRODUCTS
        ========================= */}

        <div className="order-section">

          <h2>
            Ordered Products
          </h2>

          <div className="order-products">

            {order.items?.map((item) => {

              const price =
                Number(item.price) || 0;

              const quantity =
                Number(item.quantity) || 1;

              const itemTotal =
                price * quantity;

              return (

                <div
                  className="order-product"
                  key={item._id}
                >

                  {/* IMAGE */}

                  <div className="order-product-image">

                    {item.image ? (

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                    ) : (

                      <span>
                        🛒
                      </span>

                    )}

                  </div>


                  {/* DETAILS */}

                  <div className="order-product-details">

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      Qty: {quantity}
                    </p>

                    <p>
                      ₹{price} × {quantity}
                    </p>

                  </div>


                  {/* ITEM TOTAL */}

                  <strong>
                    ₹{itemTotal}
                  </strong>

                </div>

              );

            })}

          </div>

        </div>


        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <div className="order-summary">

          {/* SUBTOTAL */}

          <div className="order-summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              ₹{subtotal}
            </strong>

          </div>


          {/* DELIVERY */}

          <div className="order-summary-row">

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

          <div className="order-total">

            <span>
              Total
            </span>

            <strong>
              ₹{total}
            </strong>

          </div>

        </div>


        {/* =========================
            ACTION BUTTONS
        ========================= */}

        <div className="order-actions">

          <Link
            to="/products"
            className="order-button"
          >
            Continue Shopping
          </Link>


          <Link
            to="/"
            className="order-home-button"
          >
            Go to Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Order;
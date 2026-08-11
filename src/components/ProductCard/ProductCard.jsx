import "./ProductCard.css";

import {
  FaShoppingCart,
  FaHeart,
  FaStar
} from "react-icons/fa";

import { useContext } from "react";
import { Link } from "react-router-dom";

import { CartContext } from "../../context/CartContext";

function ProductCard({ product }) {

  const { addToCart } = useContext(CartContext);

  const rating = Number(product.rating) || 4.5;

  const price = Number(product.price) || 0;

  const discount = Number(product.discount) || 0;

  const finalPrice =
    product.finalPrice !== undefined &&
    product.finalPrice !== null
      ? Number(product.finalPrice)
      : discount > 0
        ? Math.round(
            price - (price * discount) / 100
          )
        : price;

  const stock = Number(product.stock) || 0;

  const handleAddToCart = () => {
    if (stock <= 0) return;

    addToCart(product);

    alert(`${product.name} added to cart`);
  };

  return (
    <div className="product-card">

      {/* DISCOUNT */}

      {discount > 0 && (
        <div className="discount-badge">
          {discount}% OFF
        </div>
      )}


      {/* WISHLIST */}

      <button
        type="button"
        className="wishlist-btn"
      >
        <FaHeart />
      </button>


      {/* PRODUCT IMAGE */}

      <Link
        to={`/products/${product._id}`}
        className="product-image-link"
      >

        <img
          src={
            product.image ||
            "/default-product.png"
          }
          alt={product.name || "Product"}
          className="product-image"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              "/default-product.png";
          }}
        />

      </Link>


      {/* PRODUCT INFORMATION */}

      <div className="product-body">

        {/* BRAND */}

        <p className="product-brand">
          {product.brand || "HOMEKART"}
        </p>


        {/* NAME */}

        <Link
          to={`/products/${product._id}`}
          className="product-name"
        >
          {product.name}
        </Link>


        {/* RATING */}

        <div className="rating-row">

          <span>
            {rating}
          </span>

          <FaStar />

        </div>


        {/* PRICE */}

        <div className="price-row">

          <span className="price">
            ₹{finalPrice.toLocaleString("en-IN")}
          </span>

          {discount > 0 && (
            <span className="old-price">
              ₹{price.toLocaleString("en-IN")}
            </span>
          )}

        </div>


        {/* STOCK */}

        <p
          className={
            stock > 0
              ? "stock in-stock"
              : "stock out-of-stock"
          }
        >

          {stock > 0
            ? `In Stock (${stock})`
            : "Out of Stock"}

        </p>


        {/* ADD TO CART */}

        <button
          type="button"
          className="cart-btn"
          disabled={stock <= 0}
          onClick={handleAddToCart}
        >

          <FaShoppingCart />

          {stock > 0
            ? "Add to Cart"
            : "Out of Stock"}

        </button>

      </div>

    </div>
  );
}

export default ProductCard;
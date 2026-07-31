import { FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";
import "./ProductCard.css";

function ProductCard({ product }) {
  return (
    <div className="product-card">

      <button className="wishlist-button">
        <FaHeart />
      </button>

      <div className="product-image">
        <span>{product.icon}</span>
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>

        <p className="product-description">
          {product.description}
        </p>

        <div className="rating">
          <FaStar />
          <span>{product.rating}</span>
        </div>

        <div className="price">
          ₹{product.price}
        </div>

        <button className="add-cart">
          <FaShoppingCart />
          Add to Cart
        </button>
      </div>

    </div>
  );
}

export default ProductCard;
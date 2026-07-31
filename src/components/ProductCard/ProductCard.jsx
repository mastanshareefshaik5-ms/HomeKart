import { useContext } from "react";
import { FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

import { CartContext } from "../../context/CartContext";

import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product-card">

      <button className="wishlist-button">
        <FaHeart />
      </button>

      <Link
        to={`/product-details/${product.id}`}
        className="product-link"
      >
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

        </div>
      </Link>

      <button
        className="add-cart"
        onClick={handleAddToCart}
      >
        <FaShoppingCart />
        Add to Cart
      </button>

    </div>
  );
}

export default ProductCard;
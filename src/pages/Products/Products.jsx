import { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import { useContext } from "react";

import { CartContext } from "../../context/CartContext";

import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(response.data);
    } catch (error) {
      console.error("PRODUCT FETCH ERROR:", error);

      setError("Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="products-message">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-message error">
        {error}
      </div>
    );
  }

  return (
    <div className="products-page">

      <div className="products-header">
        <h1>HOMEKART Products</h1>

        <p>
          Everyday household essentials at great prices
        </p>
      </div>

      <div className="products-grid">

        {products.map((product) => (

          <div
            className="product-card"
            key={product._id}
          >

            <div className="product-image-container">

              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />

            </div>

            <div className="product-info">

              <p className="product-brand">
                {product.brand}
              </p>

              <h2>
                {product.name}
              </h2>

              <p className="product-description">
                {product.description}
              </p>

              <div className="product-rating">

                <span>
                  {product.rating}
                </span>

                <FaStar />

              </div>

              <div className="product-price">
                ₹{product.price}
              </div>

              <p className="product-stock">
                {product.stock > 0
                  ? `In Stock (${product.stock})`
                  : "Out of Stock"}
              </p>

              <button
                className="add-cart-button"
                disabled={product.stock === 0}
                onClick={() => addToCart(product)}
              >
                <FaShoppingCart />

                {product.stock > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Products;
import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaStar, FaShoppingCart } from "react-icons/fa";

import { CartContext } from "../../context/CartContext";

import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );

        if (mounted) {
          setProduct(response.data);
        }
      } catch (error) {
        console.error(
          "PRODUCT DETAILS ERROR:",
          error
        );

        if (mounted) {
          setError("Product not found");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, [id]);

  const getImageUrl = (image) => {
    if (
      !image ||
      typeof image !== "string"
    ) {
      return "/default-product.png";
    }

    const cleanImage = image.trim();

    if (cleanImage === "") {
      return "/default-product.png";
    }

    if (
      cleanImage.startsWith("http://") ||
      cleanImage.startsWith("https://")
    ) {
      return cleanImage;
    }

    if (cleanImage.startsWith("/")) {
      return cleanImage;
    }

    return `/${cleanImage}`;
  };

  if (loading) {
    return (
      <div className="product-not-found">
        <h2>
          Loading product...
        </h2>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-not-found">
        <h2>
          Product Not Found
        </h2>

        <p>
          The product you are looking for
          does not exist.
        </p>

        <Link to="/products">
          Back to Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.stock === 0) {
      return;
    }

    addToCart(product);

    alert(
      `${product.name} added to cart`
    );
  };

  return (
    <div className="product-details-page">

      <div className="product-details-container">

        {/* PRODUCT IMAGE */}

        <div className="product-details-image">

          <img
            src={getImageUrl(product.image)}
            alt={
              product.name ||
              "Product"
            }
            onError={(event) => {
              event.currentTarget.onerror =
                null;

              event.currentTarget.src =
                "/default-product.png";
            }}
          />

        </div>


        {/* PRODUCT INFORMATION */}

        <div className="product-details-info">

          {/* PRODUCT NAME */}

          <h1>
            {product.name}
          </h1>


          {/* DESCRIPTION */}

          <p className="product-description-large">
            {product.description ||
              "Quality household product."}
          </p>


          {/* RATING */}

          <div className="product-rating">

            <FaStar />

            <span>
              {product.rating || 0}
            </span>

            <span>
              Customer Rating
            </span>

          </div>


          {/* PRICE */}

          <div className="product-details-price">
            ₹{product.price}
          </div>


          {/* BRAND */}

          <p className="product-details-text">

            <strong>
              Brand:
            </strong>{" "}

            {product.brand ||
              "HOMEKART"}

          </p>


          {/* STOCK */}

          <p className="product-details-text">

            <strong>
              Availability:
            </strong>{" "}

            {product.stock > 0
              ? `In Stock (${product.stock})`
              : "Out of Stock"}

          </p>


          {/* DETAILS */}

          <p className="product-details-text">

            {product.details ||
              product.description ||
              "Premium quality household product suitable for everyday use."}

          </p>


          {/* ACTION BUTTONS */}

          <div className="product-actions">

            {/* ADD TO CART */}

            <button
              className="details-add-cart"
              onClick={handleAddToCart}
              disabled={
                product.stock === 0
              }
            >

              <FaShoppingCart />

              {product.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}

            </button>


            {/* BUY NOW */}

            <Link
              to="/cart"
              className="buy-now"
            >
              Buy Now
            </Link>

          </div>


          {/* BACK TO PRODUCTS */}

          <Link
            to="/products"
            className="back-to-products"
          >
            ← Back to Products
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;
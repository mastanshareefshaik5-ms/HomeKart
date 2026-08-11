import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import "./Products.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  `${import.meta.env.VITE_API_URL}/api/auth/login`;

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/products`
      );

      const data = await response.json();

      console.log("PRODUCTS:", data);

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load products"
        );
      }

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }

    } catch (error) {
      console.error(
        "PRODUCT FETCH ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to load products"
      );

    } finally {
      setLoading(false);
    }
  };

  const getFinalPrice = (product) => {
    if (
      product.finalPrice !== undefined &&
      product.finalPrice !== null
    ) {
      return Number(product.finalPrice);
    }

    const price =
      Number(product.price) || 0;

    const discount =
      Number(product.discount) || 0;

    return (
      price -
      (price * discount) / 100
    );
  };

  const handleAddToCart = (product) => {
    addToCart(product);

    alert(
      `${product.name} added to cart`
    );
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="products-message">
          Loading products...
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">

      {/* HEADER */}

      <div className="products-header">

        <h1>
          HOMEKART Products
        </h1>

        <p>
          Quality products at
          affordable prices
        </p>

      </div>


      {/* NO PRODUCTS */}

      {products.length === 0 ? (

        <div className="products-message">

          <h2>
            No Products Available
          </h2>

          <p>
            Please check back later.
          </p>

        </div>

      ) : (

        /* PRODUCTS */

        <div className="products-grid">

          {products.map((product) => {

            const price =
              Number(product.price) || 0;

            const finalPrice =
              getFinalPrice(product);

            const discount =
              Number(product.discount) || 0;

            const stock =
              Number(product.stock) || 0;

            return (

              <div
                className="product-card"
                key={product._id}
              >

                {/* IMAGE */}

                <Link
                  to={`/products/${product._id}`}
                  className="product-image-link"
                >

                  <img
                    src={
                      product.image ||
                      "https://via.placeholder.com/300"
                    }
                    alt={product.name}
                    className="product-image"
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://via.placeholder.com/300";
                    }}
                  />

                </Link>


                {/* DETAILS */}

                <div className="product-details">

                  <Link
                    to={`/products/${product._id}`}
                    className="product-name"
                  >
                    {product.name}
                  </Link>


                  {/* PRICE */}

                  <div className="product-price">

                    <span className="final-price">
                      ₹
                      {finalPrice.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    {discount > 0 && (
                      <>
                        <span className="original-price">
                          ₹
                          {price.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        <span className="discount">
                          {discount}% OFF
                        </span>
                      </>
                    )}

                  </div>


                  {/* STOCK */}

                  <div
                    className={
                      stock > 0
                        ? "in-stock"
                        : "out-of-stock"
                    }
                  >
                    {stock > 0
                      ? "In Stock"
                      : "Out of Stock"}
                  </div>


                  {/* ADD TO CART */}

                  <button
                    type="button"
                    className="add-to-cart-btn"
                    disabled={stock <= 0}
                    onClick={() =>
                      handleAddToCart(product)
                    }
                  >
                    {stock > 0
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </button>

                </div>

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
}

export default Products;
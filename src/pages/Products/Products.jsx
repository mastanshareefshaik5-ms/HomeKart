import { useEffect, useState, useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";

import {
  FaShoppingCart,
  FaStar,
  FaSearch
} from "react-icons/fa";

import { CartContext } from "../../context/CartContext";

import "./Products.css";

function Products() {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchText, setSearchText] =
    useState("");

  const [searchParams, setSearchParams] =
    useSearchParams();

  const selectedCategory =
    searchParams.get("category") || "All";

  const { addToCart } =
    useContext(CartContext);


  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {

    let mounted = true;

    const fetchProducts = async () => {

      try {

        const response = await axios.get(
          "http://localhost:5000/api/products"
        );

        if (mounted) {

          setProducts(
            Array.isArray(response.data)
              ? response.data
              : []
          );

        }

      } catch (error) {

        console.error(
          "PRODUCT FETCH ERROR:",
          error
        );

        if (mounted) {

          setError(
            "Unable to load products"
          );

        }

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }

    };

    fetchProducts();

    return () => {
      mounted = false;
    };

  }, []);


  // ==========================================
  // SEARCH + CATEGORY FILTER
  // ==========================================

  const filteredProducts =
    products.filter((product) => {

      const categoryMatch =
        selectedCategory === "All" ||
        product.category?.toLowerCase() ===
        selectedCategory.toLowerCase();


      const searchMatch =
        product.name
          ?.toLowerCase()
          .includes(
            searchText.toLowerCase()
          ) ||

        product.brand
          ?.toLowerCase()
          .includes(
            searchText.toLowerCase()
          ) ||

        product.description
          ?.toLowerCase()
          .includes(
            searchText.toLowerCase()
          );


      return (
        categoryMatch &&
        searchMatch
      );

    });


  // ==========================================
  // CATEGORY CHANGE
  // ==========================================

  const handleCategoryChange = (
    event
  ) => {

    const category =
      event.target.value;

    if (category === "All") {

      setSearchParams({});

    } else {

      setSearchParams({
        category
      });

    }

  };


  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (image) => {

    if (
      !image ||
      typeof image !== "string"
    ) {

      return "/default-product.png";

    }

    const cleanImage =
      image.trim();

    if (cleanImage === "") {

      return "/default-product.png";

    }

    if (
      cleanImage.startsWith("http://") ||
      cleanImage.startsWith("https://")
    ) {

      return cleanImage;

    }

    if (
      cleanImage.startsWith("/")
    ) {

      return cleanImage;

    }

    return `/${cleanImage}`;

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="products-message">

        Loading products...

      </div>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (

      <div className="products-message error">

        {error}

      </div>

    );

  }


  return (

    <div className="products-page">


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="products-header">

        <h1>
          HOMEKART Products
        </h1>

        <p>
          Everyday household essentials
          at great prices
        </p>


        {/* SEARCH */}

        <div className="product-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search products..."
            value={searchText}
            onChange={(event) =>
              setSearchText(
                event.target.value
              )
            }
          />

        </div>


        {/* CATEGORY */}

        <div className="category-filter">

          <label>
            Category:
          </label>

          <select
            value={selectedCategory}
            onChange={
              handleCategoryChange
            }
          >

            <option value="All">
              All Products
            </option>

            <option value="Groceries">
              Groceries
            </option>

            <option value="Fruits & Vegetables">
              Fruits & Vegetables
            </option>

            <option value="Dairy Products">
              Dairy Products
            </option>

            <option value="Snacks">
              Snacks
            </option>

            <option value="Cleaning">
              Cleaning
            </option>

            <option value="Personal Care">
              Personal Care
            </option>

          </select>

        </div>

      </div>


      {/* ======================================
          PRODUCT COUNT
      ====================================== */}

      <div className="product-count">

        {filteredProducts.length} product
        {filteredProducts.length !== 1
          ? "s"
          : ""} found

      </div>


      {/* ======================================
          NO PRODUCTS
      ====================================== */}

      {filteredProducts.length === 0 ? (

        <div className="products-message">

          <h2>
            No products found
          </h2>

          <p>
            Try another product name or
            category.
          </p>

        </div>

      ) : (


        /* ====================================
           PRODUCTS GRID
        ==================================== */

        <div className="products-grid">

          {filteredProducts.map(
            (product) => (

              <Link
                to={`/product-details/${product._id}`}
                className="product-card"
                key={product._id}
              >


                {/* IMAGE */}

                <div className="product-image-container">

                  <img
                    src={getImageUrl(
                      product.image
                    )}
                    alt={
                      product.name ||
                      "Product"
                    }
                    className="product-image"
                    loading="lazy"
                    onError={(event) => {

                      event.currentTarget.onerror =
                        null;

                      event.currentTarget.src =
                        "/default-product.png";

                    }}
                  />

                </div>


                {/* PRODUCT INFO */}

                <div className="product-info">


                  {/* BRAND */}

                  <p className="product-brand">

                    {product.brand ||
                      "HOMEKART"}

                  </p>


                  {/* NAME */}

                  <h2>
                    {product.name}
                  </h2>


                  {/* DESCRIPTION */}

                  <p className="product-description">

                    {product.description ||
                      "Quality household product."}

                  </p>


                  {/* RATING */}

                  <div className="product-rating">

                    <span>
                      {product.rating || 0}
                    </span>

                    <FaStar />

                  </div>


                  {/* PRICE */}

                  <div className="product-price">

                    ₹{product.price}

                  </div>


                  {/* STOCK */}

                  <p className="product-stock">

                    {product.stock > 0
                      ? `In Stock (${product.stock})`
                      : "Out of Stock"}

                  </p>


                  {/* ADD TO CART */}

                  <button
                    className="add-cart-button"
                    disabled={
                      product.stock === 0
                    }
                    onClick={(event) => {

                      // Prevent product
                      // details navigation
                      event.preventDefault();

                      event.stopPropagation();

                      if (
                        product.stock > 0
                      ) {

                        addToCart(product);

                      }

                    }}
                  >

                    <FaShoppingCart />

                    {product.stock > 0
                      ? "Add to Cart"
                      : "Out of Stock"}

                  </button>


                </div>

              </Link>

            )
          )}

        </div>

      )}

    </div>

  );

}

export default Products;
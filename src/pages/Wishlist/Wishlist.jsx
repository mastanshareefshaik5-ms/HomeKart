import { useContext } from "react";
import { Link } from "react-router-dom";

import {
  FaHeart,
  FaTrash,
  FaShoppingCart
} from "react-icons/fa";

import { CartContext } from "../../context/CartContext";

import "./Wishlist.css";


function Wishlist() {

  const {

    wishlist,

    removeFromWishlist,

    addToCart

  } = useContext(CartContext);


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


    if (!cleanImage) {

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
  // ADD TO CART
  // ==========================================

  const handleAddToCart =
    (product) => {

      addToCart(product);

    };


  // ==========================================
  // EMPTY WISHLIST
  // ==========================================

  if (wishlist.length === 0) {

    return (

      <div className="wishlist-empty">

        <div className="wishlist-empty-icon">

          <FaHeart />

        </div>


        <h1>
          Your Wishlist is Empty
        </h1>


        <p>
          Save your favorite
          HOMEKART products here.
        </p>


        <Link
          to="/products"
          className="wishlist-shop-button"
        >

          Explore Products

        </Link>

      </div>

    );

  }


  return (

    <div className="wishlist-page">

      <div className="wishlist-container">


        {/* HEADER */}

        <div className="wishlist-header">

          <h1>

            My Wishlist ❤️

          </h1>


          <p>

            {wishlist.length} product
            {wishlist.length !== 1
              ? "s"
              : ""} saved

          </p>

        </div>


        {/* PRODUCTS */}

        <div className="wishlist-grid">

          {wishlist.map(
            (product) => (

              <div
                className="wishlist-card"
                key={product._id}
              >


                {/* IMAGE */}

                <div className="wishlist-image">

                  <Link
                    to={`/product-details/${product._id}`}
                  >

                    <img
                      src={getImageUrl(
                        product.image
                      )}
                      alt={
                        product.name ||
                        "Product"
                      }
                      onError={(
                        event
                      ) => {

                        event.currentTarget.onerror =
                          null;

                        event.currentTarget.src =
                          "/default-product.png";

                      }}
                    />

                  </Link>

                </div>


                {/* DETAILS */}

                <div className="wishlist-details">


                  <p className="wishlist-brand">

                    {product.brand ||
                      "HOMEKART"}

                  </p>


                  <h2>

                    {product.name}

                  </h2>


                  <p className="wishlist-description">

                    {product.description ||
                      "Quality household product."}

                  </p>


                  <strong className="wishlist-price">

                    ₹{product.price}

                  </strong>


                  {/* STOCK */}

                  <p className="wishlist-stock">

                    {product.stock > 0

                      ? `In Stock (${product.stock})`

                      : "Out of Stock"}

                  </p>


                  {/* ACTIONS */}

                  <div className="wishlist-actions">


                    {/* ADD TO CART */}

                    <button
                      className="wishlist-cart-button"
                      disabled={
                        product.stock === 0
                      }
                      onClick={() =>
                        handleAddToCart(
                          product
                        )
                      }
                    >

                      <FaShoppingCart />

                      {product.stock > 0
                        ? "Add to Cart"
                        : "Out of Stock"}

                    </button>


                    {/* VIEW */}

                    <Link
                      to={`/product-details/${product._id}`}
                      className="wishlist-view-button"
                    >

                      View

                    </Link>


                    {/* REMOVE */}

                    <button
                      className="wishlist-remove-button"
                      onClick={() =>
                        removeFromWishlist(
                          product._id
                        )
                      }
                      title="Remove from wishlist"
                    >

                      <FaTrash />

                    </button>

                  </div>


                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>

  );

}


export default Wishlist;
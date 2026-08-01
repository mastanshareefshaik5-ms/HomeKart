import { useContext } from "react";
import {
  FaShoppingCart,
  FaHeart,
  FaStar
} from "react-icons/fa";
import { Link } from "react-router-dom";

import { CartContext } from "../../context/CartContext";

import "./ProductCard.css";

function ProductCard({ product }) {

  const { addToCart } = useContext(CartContext);


  // =========================
  // PRODUCT ID
  // =========================

  const productId =
    product?._id ||
    product?.id;


  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = (event) => {

    // Prevent Link navigation
    event.preventDefault();
    event.stopPropagation();

    addToCart(product);

  };


  // =========================
  // WISHLIST
  // =========================

  const handleWishlist = (event) => {

    event.preventDefault();
    event.stopPropagation();

    const savedWishlist =
      JSON.parse(
        localStorage.getItem(
          "homekart-wishlist"
        )
      ) || [];


    const alreadyExists =
      savedWishlist.some(
        (item) =>
          (item._id || item.id) === productId
      );


    let updatedWishlist;


    if (alreadyExists) {

      updatedWishlist =
        savedWishlist.filter(
          (item) =>
            (item._id || item.id) !== productId
        );

    } else {

      updatedWishlist = [
        ...savedWishlist,
        product
      ];

    }


    localStorage.setItem(
      "homekart-wishlist",
      JSON.stringify(
        updatedWishlist
      )
    );


    // Refresh UI
    window.dispatchEvent(
      new Event("wishlistUpdated")
    );

  };


  return (

    <div className="product-card">


      {/* =========================
          WISHLIST
      ========================= */}

      <button
        type="button"
        className="wishlist-button"
        onClick={handleWishlist}
      >

        <FaHeart />

      </button>


      {/* =========================
          PRODUCT DETAILS LINK
      ========================= */}

      <Link
        to={`/product-details/${productId}`}
        className="product-link"
      >


        {/* PRODUCT IMAGE */}

        <div className="product-image">

          {product?.image ? (

            <img
              src={product.image}
              alt={product.name}
            />

          ) : (

            <span>
              {product?.icon || "🛒"}
            </span>

          )}

        </div>


        {/* PRODUCT INFORMATION */}

        <div className="product-info">


          <h3>
            {product?.name}
          </h3>


          {product?.description && (

            <p className="product-description">
              {product.description}
            </p>

          )}


          {/* RATING */}

          <div className="rating">

            <FaStar />

            <span>
              {product?.rating || "4.5"}
            </span>

          </div>


          {/* PRICE */}

          <div className="price">

            ₹{product?.price}

          </div>


        </div>


      </Link>


      {/* =========================
          ADD TO CART
      ========================= */}

      <button
        type="button"
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
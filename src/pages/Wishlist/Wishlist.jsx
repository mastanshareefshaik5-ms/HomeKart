import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash, FaShoppingCart } from "react-icons/fa";

import "./Wishlist.css";

function Wishlist() {

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {

    const savedWishlist =
      JSON.parse(
        localStorage.getItem("homekart-wishlist")
      ) || [];

    setWishlist(savedWishlist);

  }, []);


  // REMOVE FROM WISHLIST

  const removeFromWishlist = (productId) => {

    const updatedWishlist =
      wishlist.filter(
        (item) => item._id !== productId
      );

    setWishlist(updatedWishlist);

    localStorage.setItem(
      "homekart-wishlist",
      JSON.stringify(updatedWishlist)
    );

  };


  // EMPTY WISHLIST

  if (wishlist.length === 0) {

    return (

      <div className="wishlist-empty">

        <div className="wishlist-empty-icon">
          ❤️
        </div>

        <h1>
          Your Wishlist is Empty
        </h1>

        <p>
          Save your favorite products here.
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

        <div className="wishlist-header">

          <h1>
            My Wishlist ❤️
          </h1>

          <p>
            Your favorite HOMEKART products
          </p>

        </div>


        <div className="wishlist-grid">

          {wishlist.map((product) => (

            <div
              className="wishlist-card"
              key={product._id}
            >

              {/* IMAGE */}

              <div className="wishlist-image">

                {product.image ? (

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                ) : (

                  <span>
                    🛒
                  </span>

                )}

              </div>


              {/* DETAILS */}

              <div className="wishlist-details">

                <p className="wishlist-brand">
                  {product.brand}
                </p>

                <h2>
                  {product.name}
                </h2>

                <p className="wishlist-description">
                  {product.description}
                </p>

                <strong className="wishlist-price">
                  ₹{product.price}
                </strong>


                {/* BUTTONS */}

                <div className="wishlist-actions">

                  <Link
                    to={`/product-details/${product._id}`}
                    className="wishlist-cart-button"
                  >
                    <FaShoppingCart />
                    View Product
                  </Link>


                  <button
                    className="wishlist-remove-button"
                    onClick={() =>
                      removeFromWishlist(
                        product._id
                      )
                    }
                  >
                    <FaTrash />
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default Wishlist;
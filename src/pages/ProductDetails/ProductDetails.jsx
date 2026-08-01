import { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaShoppingCart } from "react-icons/fa";

import { CartContext } from "../../context/CartContext";

import "./ProductDetails.css";


// =====================================================
// HOMEKART STATIC PRODUCTS
// =====================================================

const products = [

  {
    id: "1",
    name: "Chilli Powder",
    description: "Pure red chilli powder - 500g",
    price: 180,
    rating: 4.5,
    icon: "🌶️",
    image: "",
    category: "Spices",
    details:
      "Premium quality red chilli powder suitable for everyday cooking."
  },

  {
    id: "2",
    name: "Turmeric Powder",
    description: "Premium turmeric powder - 200g",
    price: 90,
    rating: 4.6,
    icon: "🟡",
    image: "",
    category: "Spices",
    details:
      "High-quality turmeric powder for curries and everyday cooking."
  },

  {
    id: "3",
    name: "Basmati Rice",
    description: "Premium basmati rice - 5kg",
    price: 650,
    rating: 4.7,
    icon: "🍚",
    image: "",
    category: "Rice & Dal",
    details:
      "Long-grain premium basmati rice suitable for biryani and daily meals."
  },

  {
    id: "4",
    name: "Cooking Oil",
    description: "Refined cooking oil - 1L",
    price: 145,
    rating: 4.4,
    icon: "🛢️",
    image: "",
    category: "Oils",
    details:
      "Quality cooking oil suitable for frying and everyday cooking."
  },

  {
    id: "5",
    name: "Dishwash Liquid",
    description: "Lemon dishwash liquid - 500ml",
    price: 120,
    rating: 4.5,
    icon: "🧴",
    image: "",
    category: "Cleaning",
    details:
      "Lemon dishwashing liquid designed to help clean dishes effectively."
  },

  {
    id: "6",
    name: "Detergent Powder",
    description: "Powerful cleaning detergent - 1kg",
    price: 210,
    rating: 4.3,
    icon: "🧼",
    image: "",
    category: "Cleaning",
    details:
      "Powerful detergent powder for everyday clothes washing."
  },

  {
    id: "7",
    name: "Bath Soap",
    description: "Refreshing bath soap - Pack of 4",
    price: 160,
    rating: 4.6,
    icon: "🧴",
    image: "",
    category: "Personal Care",
    details:
      "Refreshing bath soap suitable for everyday personal care."
  },

  {
    id: "8",
    name: "Sugar",
    description: "Premium white sugar - 1kg",
    price: 55,
    rating: 4.5,
    icon: "🍚",
    image: "",
    category: "Grocery",
    details:
      "Premium white sugar for tea, coffee, sweets and cooking."
  },


  // =====================================================
  // HOME PAGE PRODUCTS
  // =====================================================

  {
    id: "home-rice-5kg",
    name: "Basmati Rice 5kg",
    description:
      "Premium quality basmati rice for your daily needs.",
    price: 650,
    rating: 4.7,
    icon: "🍚",
    image: "",
    category: "Groceries",
    details:
      "Premium long-grain basmati rice suitable for biryani, pulao and everyday meals."
  },

  {
    id: "home-oil-1l",
    name: "Sunflower Oil 1L",
    description:
      "Healthy and refined sunflower cooking oil.",
    price: 150,
    rating: 4.6,
    icon: "🛢️",
    image: "",
    category: "Cooking Oils",
    details:
      "Refined sunflower oil suitable for frying and everyday cooking."
  },

  {
    id: "home-milk",
    name: "Premium Milk",
    description:
      "Fresh and nutritious premium quality milk.",
    price: 60,
    rating: 4.8,
    icon: "🥛",
    image: "",
    category: "Dairy Products",
    details:
      "Fresh and nutritious milk suitable for drinking, tea, coffee and cooking."
  },

  {
    id: "home-chocolate",
    name: "Chocolate Snacks",
    description:
      "Delicious chocolate snacks for everyone.",
    price: 120,
    rating: 4.5,
    icon: "🍫",
    image: "",
    category: "Snacks",
    details:
      "Delicious chocolate snacks perfect for enjoying with family and friends."
  }

];


// =====================================================
// COMPONENT
// =====================================================

function ProductDetails() {

  const { id } = useParams();

  const { addToCart } =
    useContext(CartContext);


  // ===================================================
  // FIND PRODUCT
  // ===================================================

  const product = products.find(
    (item) =>
      String(item.id) === String(id)
  );


  // ===================================================
  // PRODUCT NOT FOUND
  // ===================================================

  if (!product) {

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


  // ===================================================
  // ADD TO CART
  // ===================================================

  const handleAddToCart = () => {

    addToCart(product);

  };


  return (

    <div className="product-details-page">

      <div className="product-details-container">


        {/* ============================================
            PRODUCT IMAGE
        ============================================ */}

        <div className="product-details-image">

          {product.image ? (

            <img
              src={product.image}
              alt={product.name}
            />

          ) : (

            <span className="product-details-icon">
              {product.icon}
            </span>

          )}

        </div>


        {/* ============================================
            PRODUCT INFORMATION
        ============================================ */}

        <div className="product-details-info">


          <p className="product-category">
            {product.category}
          </p>


          <h1>
            {product.name}
          </h1>


          <p className="product-description-large">
            {product.description}
          </p>


          {/* RATING */}

          <div className="product-rating">

            <FaStar />

            <span>
              {product.rating}
            </span>

            <span>
              Customer Rating
            </span>

          </div>


          {/* PRICE */}

          <div className="product-details-price">

            ₹{product.price}

          </div>


          {/* DETAILS */}

          <p className="product-details-text">

            {product.details}

          </p>


          {/* ACTION BUTTONS */}

          <div className="product-actions">


            <button
              className="details-add-cart"
              onClick={handleAddToCart}
            >

              <FaShoppingCart />

              Add to Cart

            </button>


            <Link
              to="/cart"
              className="buy-now"
            >

              Buy Now

            </Link>


          </div>


        </div>


      </div>


    </div>

  );

}


export default ProductDetails;
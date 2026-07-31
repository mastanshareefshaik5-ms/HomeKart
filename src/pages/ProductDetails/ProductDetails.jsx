import { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaShoppingCart } from "react-icons/fa";

import { CartContext } from "../../context/CartContext";

import "./ProductDetails.css";

const products = [
  {
    id: 1,
    name: "Chilli Powder",
    description: "Pure red chilli powder - 500g",
    price: 180,
    rating: 4.5,
    icon: "🌶️",
    category: "Spices",
    details:
      "Premium quality red chilli powder suitable for everyday cooking."
  },
  {
    id: 2,
    name: "Turmeric Powder",
    description: "Premium turmeric powder - 200g",
    price: 90,
    rating: 4.6,
    icon: "🟡",
    category: "Spices",
    details:
      "High-quality turmeric powder for curries and everyday cooking."
  },
  {
    id: 3,
    name: "Basmati Rice",
    description: "Premium basmati rice - 5kg",
    price: 650,
    rating: 4.7,
    icon: "🍚",
    category: "Rice & Dal",
    details:
      "Long-grain premium basmati rice suitable for biryani and daily meals."
  },
  {
    id: 4,
    name: "Cooking Oil",
    description: "Refined cooking oil - 1L",
    price: 145,
    rating: 4.4,
    icon: "🛢️",
    category: "Oils",
    details:
      "Quality cooking oil suitable for frying and everyday cooking."
  },
  {
    id: 5,
    name: "Dishwash Liquid",
    description: "Lemon dishwash liquid - 500ml",
    price: 120,
    rating: 4.5,
    icon: "🧴",
    category: "Cleaning",
    details:
      "Lemon dishwashing liquid designed to help clean dishes effectively."
  },
  {
    id: 6,
    name: "Detergent Powder",
    description: "Powerful cleaning detergent - 1kg",
    price: 210,
    rating: 4.3,
    icon: "🧼",
    category: "Cleaning",
    details:
      "Powerful detergent powder for everyday clothes washing."
  },
  {
    id: 7,
    name: "Bath Soap",
    description: "Refreshing bath soap - Pack of 4",
    price: 160,
    rating: 4.6,
    icon: "🧴",
    category: "Personal Care",
    details:
      "Refreshing bath soap suitable for everyday personal care."
  },
  {
    id: 8,
    name: "Sugar",
    description: "Premium white sugar - 1kg",
    price: 55,
    rating: 4.5,
    icon: "🍚",
    category: "Grocery",
    details:
      "Premium white sugar for tea, coffee, sweets and cooking."
  }
];

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <Link to="/products">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="product-details-page">

      <div className="product-details-container">

        <div className="product-details-image">
          <span>{product.icon}</span>
        </div>

        <div className="product-details-info">

          <p className="product-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <p className="product-description-large">
            {product.description}
          </p>

          <div className="product-rating">
            <FaStar />
            <span>{product.rating}</span>
            <span>Customer Rating</span>
          </div>

          <div className="product-details-price">
            ₹{product.price}
          </div>

          <p className="product-details-text">
            {product.details}
          </p>

          <div className="product-actions">

            <button
              className="details-add-cart"
              onClick={() => addToCart(product)}
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
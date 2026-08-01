import { Link } from "react-router-dom";
import "./Categories.css";

function Categories() {
  const categories = [
    {
      name: "Spices",
      icon: "🌶️",
      description: "Chilli powder, turmeric, pepper and more",
    },
    {
      name: "Groceries",
      icon: "🍚",
      description: "Rice, dal, flour, salt and daily essentials",
    },
    {
      name: "Cleaning",
      icon: "🧹",
      description: "Floor cleaners, detergents and cleaning products",
    },
    {
      name: "Kitchen",
      icon: "🍳",
      description: "Kitchen tools and useful household items",
    },
    {
      name: "Personal Care",
      icon: "🧼",
      description: "Soap, shampoo and personal care products",
    },
    {
      name: "Household",
      icon: "🏠",
      description: "Everyday household products",
    },
  ];

  return (
    <div className="categories-page">

      <h1>Shop by Category</h1>

      <p className="categories-subtitle">
        Everything you need for your home
      </p>

      <div className="categories-grid">

        {categories.map((category) => (
          <Link
            to={`/products?category=${category.name}`}
            className="category-card"
            key={category.name}
          >

            <div className="category-icon">
              {category.icon}
            </div>

            <h2>{category.name}</h2>

            <p>{category.description}</p>

            <span>
              Shop Now →
            </span>

          </Link>
        ))}

      </div>

    </div>
  );
}

export default Categories;
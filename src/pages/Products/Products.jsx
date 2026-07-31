import ProductCard from "../../components/ProductCard/ProductCard";
import "./Products.css";

function Products() {
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

  return (
    <section className="products-section">

      <div className="products-header">
        <h2>Popular Household Products</h2>
        <p>Everything you need for your home</p>
      </div>

      <div className="products-grid">

        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

    </section>
  );
}

export default Products;
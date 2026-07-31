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
      icon: "🌶️"
    },
    {
      id: 2,
      name: "Turmeric Powder",
      description: "Premium turmeric powder - 200g",
      price: 90,
      rating: 4.6,
      icon: "🟡"
    },
    {
      id: 3,
      name: "Basmati Rice",
      description: "Premium basmati rice - 5kg",
      price: 650,
      rating: 4.7,
      icon: "🍚"
    },
    {
      id: 4,
      name: "Cooking Oil",
      description: "Refined cooking oil - 1L",
      price: 145,
      rating: 4.4,
      icon: "🛢️"
    },
    {
      id: 5,
      name: "Dishwash Liquid",
      description: "Lemon dishwash liquid - 500ml",
      price: 120,
      rating: 4.5,
      icon: "🧴"
    },
    {
      id: 6,
      name: "Detergent Powder",
      description: "Powerful cleaning detergent - 1kg",
      price: 210,
      rating: 4.3,
      icon: "🧼"
    },
    {
      id: 7,
      name: "Bath Soap",
      description: "Refreshing bath soap - Pack of 4",
      price: 160,
      rating: 4.6,
      icon: "🧴"
    },
    {
      id: 8,
      name: "Sugar",
      description: "Premium white sugar - 1kg",
      price: 55,
      rating: 4.5,
      icon: "🍚"
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
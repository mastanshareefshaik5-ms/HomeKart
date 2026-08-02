import "./Home.css";

import Banner from "../../components/Banner/Banner";
import ProductCard from "../../components/ProductCard/ProductCard";

function Home() {

  const categories = [
    {
      name: "Groceries",
      icon: "🛒"
    },
    {
      name: "Fruits & Vegetables",
      icon: "🥦"
    },
    {
      name: "Dairy Products",
      icon: "🥛"
    },
    {
      name: "Snacks",
      icon: "🍪"
    },
    {
      name: "Cleaning",
      icon: "🧼"
    },
    {
      name: "Personal Care",
      icon: "🧴"
    }
  ];


  const products = [

    {
      id: "home-rice-5kg",
      name: "Basmati Rice 5kg",
      price: 650,
      description:
        "Premium quality basmati rice for your daily needs.",
      rating: 4.7,
      icon: "🍚"
    },

    {
      id: "home-oil-1l",
      name: "Sunflower Oil 1L",
      price: 150,
      description:
        "Healthy and refined sunflower cooking oil.",
      rating: 4.6,
      icon: "🛢️"
    },

    {
      id: "home-milk",
      name: "Premium Milk",
      price: 60,
      description:
        "Fresh and nutritious premium quality milk.",
      rating: 4.8,
      icon: "🥛"
    },

    {
      id: "home-chocolate",
      name: "Chocolate Snacks",
      price: 120,
      description:
        "Delicious chocolate snacks for everyone.",
      rating: 4.5,
      icon: "🍫"
    }

  ];


  // ==========================================
  // CATEGORY CLICK
  // ==========================================

  const handleCategoryClick = (category) => {

    window.location.href =
      `/products?category=${encodeURIComponent(category)}`;

  };


  return (

    <div className="home">


      {/* =====================================
          BANNER
      ===================================== */}

      <Banner />


      {/* =====================================
          HERO
      ===================================== */}

      <section className="hero">

        <h1>
          Welcome to HOMEKART
        </h1>

        <p>
          Your Daily Household Essentials
          Delivered to Your Doorstep
        </p>

        <button
          onClick={() =>
            window.location.href =
              "/products"
          }
        >
          Shop Now
        </button>

      </section>


      {/* =====================================
          CATEGORIES
      ===================================== */}

      <section className="categories">

        <h2>
          Shop by Category
        </h2>


        <div className="category-grid">

          {categories.map(
            (item) => (

              <div
                className="category-card"
                key={item.name}
                onClick={() =>
                  handleCategoryClick(
                    item.name
                  )
                }
              >

                <div className="category-icon">

                  {item.icon}

                </div>

                <h3>

                  {item.name}

                </h3>

              </div>

            )
          )}

        </div>

      </section>


      {/* =====================================
          BEST SELLERS
      ===================================== */}

      <section className="products">

        <h2>
          🔥 Best Sellers
        </h2>


        <div className="product-grid">

          {products.map(
            (item) => (

              <ProductCard
                key={item.id}
                product={item}
              />

            )
          )}

        </div>

      </section>


    </div>

  );

}

export default Home;
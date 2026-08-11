import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

import Banner from "../../components/Banner/Banner";
import ProductCard from "../../components/ProductCard/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
       `${import.meta.env.VITE_API_URL}/api/auth/login`
      );

      const data = await res.json();

      console.log("HOME PRODUCTS:", data);

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("HOME PRODUCT ERROR:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

 const bestProducts = products;

  return (
    <div className="home">

      {/* BANNER */}
      <Banner />

      {/* HERO */}
      <section className="hero-section">

        <div className="hero-left">

          <span className="offer">
            HOMEKART PREMIUM
          </span>

          <h1>
            Fresh Indian Spices
            <br />
            Delivered To Your Door
          </h1>

          <p>
            Premium Quality Masalas
            <br />
            Fast Delivery
            <br />
            Secure Payments
          </p>

          <div className="hero-buttons">

            <Link
              to="/products"
              className="shop-btn"
            >
              Shop Now
            </Link>

            <Link
              to="/products"
              className="category-btn"
            >
              Explore Products
            </Link>

          </div>

        </div>

        <div className="hero-right">

          <img
            src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=700"
            alt="HOMEKART Products"
          />

        </div>

      </section>

      {/* FEATURES */}
      <section className="features">

        <div className="feature-card">
          🚚

          <h3>
            Free Delivery
          </h3>

          <p>
            On Orders Above ₹499
          </p>
        </div>

        <div className="feature-card">
          🔒

          <h3>
            Secure Payment
          </h3>

          <p>
            Razorpay Protected
          </p>
        </div>

        <div className="feature-card">
          ⭐

          <h3>
            Premium Quality
          </h3>

          <p>
            Trusted Products
          </p>
        </div>

        <div className="feature-card">
          ↩

          <h3>
            Easy Returns
          </h3>

          <p>
            Within 7 Days
          </p>
        </div>

      </section>

      {/* PRODUCTS */}
      <section className="product-section">

        <div className="title">

          <h2>
            Best Selling Products
          </h2>

          <Link to="/products">
            View All Products →
          </Link>

        </div>

        {loading ? (

          <h3>
            Loading products...
          </h3>

        ) : bestProducts.length === 0 ? (

          <div className="products-message">

            <h3>
              No Products Available
            </h3>

            <p>
              Please check back later.
            </p>

          </div>

        ) : (

          <div className="product-grid">

            {bestProducts.map((product) => (

              <ProductCard
                key={product._id}
                product={product}
              />

            ))}

          </div>

        )}

      </section>

      {/* ABOUT */}
      <section className="about-home">

        <h2>
          Why Choose HOMEKART?
        </h2>

        <p>
          HOMEKART delivers premium quality
          products directly from trusted
          suppliers. Every order is packed
          with care to ensure freshness,
          quality and authentic taste.
        </p>

      </section>

    </div>
  );
}

export default Home;
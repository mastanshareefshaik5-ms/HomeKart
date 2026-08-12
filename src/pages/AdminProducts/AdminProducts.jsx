import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminProducts.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/products`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(
        "PRODUCT API STATUS:",
        response.status
      );

      console.log(
        "PRODUCT API DATA:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch products"
        );
      }

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (
        Array.isArray(data.products)
      ) {
        setProducts(data.products);
      } else if (
        Array.isArray(data.data)
      ) {
        setProducts(data.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error(
        "FETCH PRODUCTS ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to load products"
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const deleteProduct = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/products/${id}`,
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      console.log(
        "DELETE PRODUCT RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete product"
        );
      }

      alert(
        "Product deleted successfully!"
      );

      setProducts(
        (previousProducts) =>
          previousProducts.filter(
            (product) =>
              product._id !== id
          )
      );
    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to delete product"
      );
    }
  };

  // ==========================================
  // CALCULATE FINAL PRICE
  // ==========================================

  const getPrice = (product) => {
    if (
      product.finalPrice !== undefined &&
      product.finalPrice !== null
    ) {
      return Number(
        product.finalPrice
      );
    }

    const price =
      Number(product.price) || 0;

    const discount =
      Number(product.discount) || 0;

    return (
      price -
      (price * discount) / 100
    );
  };

  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = () => {
    fetchProducts();
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="admin-products-page">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="admin-products-header">

        <div>
          <h1>
            Manage Products
          </h1>

          <p>
            Manage your HOMEKART
            products.
          </p>
        </div>

        <div className="admin-products-header-actions">

          <button
            type="button"
            className="admin-refresh-btn"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading
              ? "Refreshing..."
              : "↻ Refresh"}
          </button>

          <Link
            to="/admin/products/add"
            className="admin-add-product-btn"
          >
            + Add Product
          </Link>

        </div>

      </div>

      {/* ==========================================
          LOADING
      ========================================== */}

      {loading && (
        <div className="admin-products-message">
          Loading products...
        </div>
      )}

      {/* ==========================================
          NO PRODUCTS
      ========================================== */}

      {!loading &&
        products.length === 0 && (
          <div className="admin-products-message">

            <h2>
              No Products Found
            </h2>

            <p>
              No products are available
              in your database.
            </p>

            <button
              type="button"
              className="admin-refresh-btn"
              onClick={handleRefresh}
            >
              ↻ Refresh
            </button>

          </div>
        )}

      {/* ==========================================
          PRODUCTS TABLE
      ========================================== */}

      {!loading &&
        products.length > 0 && (

          <div className="admin-products-table-container">

            <table className="admin-products-table">

              <thead>

                <tr>

                  <th>
                    Image
                  </th>

                  <th>
                    Product
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Stock
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {products.map(
                  (product) => (

                    <tr
                      key={
                        product._id
                      }
                    >

                      {/* IMAGE */}

                      <td>

                        <img
                          src={
                            product.image ||
                            "https://via.placeholder.com/70"
                          }
                          alt={
                            product.name ||
                            "Product"
                          }
                          className="admin-product-image"
                          onError={(
                            event
                          ) => {
                            event.currentTarget.src =
                              "https://via.placeholder.com/70";
                          }}
                        />

                      </td>

                      {/* PRODUCT */}

                      <td>

                        <div className="admin-product-name">

                          <strong>
                            {
                              product.name
                            }
                          </strong>

                          <small>
                            SKU:{" "}
                            {
                              product.sku ||
                              "N/A"
                            }
                          </small>

                        </div>

                      </td>

                      {/* CATEGORY */}

                      <td>
                        {
                          product.category ||
                          "N/A"
                        }
                      </td>

                      {/* PRICE */}

                      <td>

                        <strong>
                          ₹
                          {getPrice(
                            product
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                        {Number(
                          product.discount
                        ) > 0 && (

                          <small className="admin-discount">

                            {
                              product.discount
                            }
                            % OFF

                          </small>

                        )}

                      </td>

                      {/* STOCK */}

                      <td>

                        <span
                          className={
                            Number(
                              product.stock
                            ) > 0
                              ? "stock-available"
                              : "stock-out"
                          }
                        >
                          {
                            product.stock
                          }
                        </span>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={
                            product.isActive
                              ? "product-active"
                              : "product-inactive"
                          }
                        >
                          {product.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="admin-product-actions">

                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="admin-edit-btn"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            className="admin-delete-btn"
                            onClick={() =>
                              deleteProduct(
                                product._id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

    </div>
  );
}

export default AdminProducts;
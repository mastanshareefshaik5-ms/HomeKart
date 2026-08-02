import React, { useEffect, useState } from "react";
import "./AdminProducts.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      const data = await response.json();

      setProducts(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Convert database image path into a browser URL
  const getImageUrl = (image) => {
    if (!image || image.trim() === "") {
      return "/default-product.png";
    }

    const cleanImage = image.trim();

    // External image
    if (
      cleanImage.startsWith("http://") ||
      cleanImage.startsWith("https://")
    ) {
      return cleanImage;
    }

    // Local image
    return `/${cleanImage.replace(/^\/+/, "")}`;
  };

  // Handle broken images
  const handleImageError = (e) => {
    if (e.currentTarget.dataset.fallback === "true") {
      return;
    }

    e.currentTarget.dataset.fallback = "true";
    e.currentTarget.src = "/default-product.png";
  };
  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    const response = await fetch(
      `http://localhost:5000/api/products/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to delete product"
      );
    }

    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => product._id !== id
      )
    );

    alert("Product deleted successfully!");

  } catch (error) {
    console.error("Delete product error:", error);

    alert(error.message);
  }
};

  return (
    <div className="admin-products">

      <div className="admin-products-header">

        <div>
          <h1>Manage Products</h1>

          <p>
            View and manage all HOMEKART products.
          </p>
        </div>

        <button
          className="add-product-btn"
          onClick={() => {
            window.location.href =
              "/admin/products/add";
          }}
        >
          + Add Product
        </button>

      </div>


      {loading ? (

        <div className="admin-loading">
          Loading products...
        </div>

      ) : products.length === 0 ? (

        <div className="admin-empty">
          No products found.
        </div>

      ) : (

        <div className="products-table-container">

          <table className="products-table">

            <thead>

              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>

            </thead>


            <tbody>

              {products.map((product) => (

                <tr key={product._id}>

                  <td>

                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name || "Product"}
                      className="admin-product-image"
                      onError={handleImageError}
                    />

                  </td>


                  <td>
                    {product.name}
                  </td>


                  <td>
                    {product.category}
                  </td>


                  <td>
                    ₹{product.price}
                  </td>


                  <td>
                    {product.stock ?? "N/A"}
                  </td>


                  <td>

                    <button
                        className="edit-btn"
                        onClick={() => {
                        window.location.href =
                        `/admin/products/edit/${product._id}`;
                    }}
                    >
                        Edit
                    </button>

                    <button
                        className="delete-btn"
                        onClick={() => handleDelete(product._id)}
                    >
                         Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default AdminProducts;
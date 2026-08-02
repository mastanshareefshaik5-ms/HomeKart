import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");

      const response = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            name: formData.name,
            category: formData.category,
            price: Number(formData.price),
            stock: Number(formData.stock),
            description: formData.description,
            image: formData.image
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add product"
        );
      }

      setMessage("Product added successfully!");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);

    } catch (error) {
      console.error("Add product error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="add-product-page">

      <div className="add-product-container">

        <h1>Add New Product</h1>

        <p className="add-product-subtitle">
          Add a new product to HOMEKART.
        </p>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Product Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Example: Chilli Powder"
              required
            />
          </div>


          <div className="form-group">
            <label>Category</label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Example: Grocery"
              required
            />
          </div>


          <div className="form-row">

            <div className="form-group">
              <label>Price (₹)</label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                required
              />
            </div>


            <div className="form-group">
              <label>Stock</label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

          </div>


          <div className="form-group">
            <label>Image URL</label>

            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter product image URL"
            />
          </div>


          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="5"
            />
          </div>


          <div className="form-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/admin/products")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-product-btn"
            >
              Add Product
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddProduct;
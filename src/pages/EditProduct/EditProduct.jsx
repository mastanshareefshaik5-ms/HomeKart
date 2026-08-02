import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditProduct.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/products/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load product"
        );
      }

      setFormData({
        name: data.name || "",
        category: data.category || "",
        price: data.price ?? "",
        stock: data.stock ?? "",
        description: data.description || "",
        image: data.image || ""
      });

    } catch (error) {
      console.error("Fetch product error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");

      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "PUT",
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
          data.message || "Failed to update product"
        );
      }

      setMessage("Product updated successfully!");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);

    } catch (error) {
      console.error("Update product error:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-product-loading">
        Loading product...
      </div>
    );
  }

  return (
    <div className="edit-product-page">

      <div className="edit-product-container">

        <h1>Edit Product</h1>

        <p className="edit-product-subtitle">
          Update HOMEKART product details.
        </p>

        {error && (
          <div className="edit-error">
            {error}
          </div>
        )}

        {message && (
          <div className="edit-success">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="edit-form-group">
            <label>Product Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="edit-form-group">
            <label>Category</label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="edit-form-row">

            <div className="edit-form-group">
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

            <div className="edit-form-group">
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

          <div className="edit-form-group">
            <label>Image</label>

            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="images/product.jpg"
            />
          </div>

          <div className="edit-form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
            />
          </div>

          <div className="edit-form-buttons">

            <button
              type="button"
              className="edit-cancel-btn"
              onClick={() => navigate("/admin/products")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="edit-save-btn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditProduct;
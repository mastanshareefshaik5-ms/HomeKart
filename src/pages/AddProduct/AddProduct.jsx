import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "HOMEKART",
    category: "",
    sku: "",
    price: "",
    discount: 0,
    stock: "",
    image: "",
    rating: 4.5,
    isActive: true
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      alert("Product name is required.");
      return;
    }

    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      alert("Enter a valid price.");
      return;
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      alert("Enter a valid stock quantity.");
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login as admin.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            name:
              formData.name.trim(),

            description:
              formData.description.trim(),

            brand:
              formData.brand.trim(),

            category:
              formData.category,

            sku:
              formData.sku.trim(),

            price:
              Number(formData.price),

            discount:
              Number(formData.discount) || 0,

            stock:
              Number(formData.stock),

            image:
              formData.image.trim(),

            rating:
              Number(formData.rating) || 4.5,

            isActive:
              formData.isActive
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create product"
        );
      }

      alert(
        "Product added successfully!"
      );

      navigate("/admin/products");

    } catch (error) {
      console.error(
        "ADD PRODUCT ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to add product"
      );

    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-add-product-page">

      <div className="admin-add-product-header">

        <div>
          <h1>
            Add Product
          </h1>

          <p>
            Add a new product to
            HOMEKART.
          </p>
        </div>

        <Link
          to="/admin/products"
          className="admin-back-btn"
        >
          ← Back to Products
        </Link>

      </div>


      <form
        className="admin-product-form"
        onSubmit={handleSubmit}
      >

        {/* PRODUCT INFORMATION */}

        <div className="admin-form-section">

          <h2>
            Product Information
          </h2>

          <div className="admin-form-grid">

            <div className="admin-form-group">

              <label>
                Product Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: Rice"
                required
              />

            </div>


            <div className="admin-form-group">

              <label>
                Brand
              </label>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="HOMEKART"
              />

            </div>


            <div className="admin-form-group">

              <label>
                Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Category
                </option>

                <option value="Groceries">
                  Groceries
                </option>

                <option value="Spices">
                  Spices
                </option>

                <option value="Masala">
                  Masala
                </option>

                <option value="Rice">
                  Rice
                </option>

                <option value="Snacks">
                  Snacks
                </option>

                <option value="Beverages">
                  Beverages
                </option>

                <option value="Cleaning">
                  Cleaning
                </option>

                <option value="Personal Care">
                  Personal Care
                </option>

                <option value="Household">
                  Household
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>


            <div className="admin-form-group">

              <label>
                SKU
              </label>

              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Example: HK-RICE-001"
              />

            </div>

          </div>


          <div className="admin-form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={
                formData.description
              }
              onChange={handleChange}
              placeholder="Enter product description..."
            />

          </div>

        </div>


        {/* PRICE */}

        <div className="admin-form-section">

          <h2>
            Price & Stock
          </h2>

          <div className="admin-form-grid">

            <div className="admin-form-group">

              <label>
                Price (₹) *
              </label>

              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />

            </div>


            <div className="admin-form-group">

              <label>
                Discount (%)
              </label>

              <input
                type="number"
                name="discount"
                min="0"
                max="100"
                value={
                  formData.discount
                }
                onChange={handleChange}
              />

            </div>


            <div className="admin-form-group">

              <label>
                Stock *
              </label>

              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required
              />

            </div>


            <div className="admin-form-group">

              <label>
                Rating
              </label>

              <input
                type="number"
                name="rating"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
              />

            </div>

          </div>

        </div>


        {/* IMAGE */}

        <div className="admin-form-section">

          <h2>
            Product Image
          </h2>

          <div className="admin-form-group">

            <label>
              Image URL
            </label>

            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />

          </div>

          {formData.image && (
            <div className="admin-image-preview">

              <img
                src={formData.image}
                alt="Product preview"
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />

            </div>
          )}

        </div>


        {/* STATUS */}

        <div className="admin-form-section">

          <h2>
            Status
          </h2>

          <label className="admin-checkbox">

            <input
              type="checkbox"
              name="isActive"
              checked={
                formData.isActive
              }
              onChange={handleChange}
            />

            Product is active

          </label>

        </div>


        {/* ACTIONS */}

        <div className="admin-form-actions">

          <Link
            to="/admin/products"
            className="admin-cancel-btn"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="admin-save-btn"
            disabled={saving}
          >
            {saving
              ? "Adding..."
              : "Add Product"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddProduct;
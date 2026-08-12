import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./EditProduct.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    category: "",
    sku: "",
    price: "",
    discount: "0",
    stock: "",
    image: "",
    rating: "4.5",
    isActive: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

     const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/products/${id}`
    );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch product"
        );
      }

      setFormData({
        name: data.name || "",
        description: data.description || "",
        brand: data.brand || "",
        category: data.category || "",
        sku: data.sku || "",
        price: data.price ?? "",
        discount: data.discount ?? 0,
        stock: data.stock ?? "",
        image: data.image || "",
        rating: data.rating ?? 4.5,
        isActive:
          data.isActive !== undefined
            ? data.isActive
            : true
      });

    } catch (error) {
      console.error(
        "FETCH PRODUCT ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to load product"
      );

      navigate("/admin/products");

    } finally {
      setLoading(false);
    }
  };

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

    if (!formData.category.trim()) {
      alert("Category is required.");
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
      alert("Enter a valid stock.");
      return;
    }

    if (
      Number(formData.discount) < 0 ||
      Number(formData.discount) > 100
    ) {
      alert(
        "Discount must be between 0 and 100."
      );
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
      `${import.meta.env.VITE_API_URL}/api/products/${id}`,
      {
         method: "PUT",

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
              formData.category.trim(),

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
            "Failed to update product"
        );
      }

      alert(
        "Product updated successfully!"
      );

      navigate("/admin/products");

    } catch (error) {
      console.error(
        "UPDATE PRODUCT ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to update product"
      );

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

      <div className="edit-product-header">

        <div>
          <h1>
            Edit Product
          </h1>

          <p>
            Update HOMEKART product
            information.
          </p>
        </div>

        <Link
          to="/admin/products"
          className="edit-product-back"
        >
          ← Back to Products
        </Link>

      </div>


      <form
        className="edit-product-form"
        onSubmit={handleSubmit}
      >

        <div className="edit-section">

          <h2>
            Product Information
          </h2>

          <div className="edit-grid">

            <div className="edit-group">

              <label>
                Product Name *
              </label>

              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>


            <div className="edit-group">

              <label>
                Brand
              </label>

              <input
                name="brand"
                type="text"
                value={formData.brand}
                onChange={handleChange}
              />

            </div>


            <div className="edit-group">

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

                <option value="Fruits & Vegetables">
                  Fruits & Vegetables
                </option>

                <option value="Dairy Products">
                  Dairy Products
                </option>

                <option value="Snacks">
                  Snacks
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


            <div className="edit-group">

              <label>
                SKU
              </label>

              <input
                name="sku"
                type="text"
                value={formData.sku}
                onChange={handleChange}
              />

            </div>

          </div>


          <div className="edit-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              rows="5"
              value={
                formData.description
              }
              onChange={handleChange}
            />

          </div>

        </div>


        <div className="edit-section">

          <h2>
            Price & Stock
          </h2>

          <div className="edit-grid">

            <div className="edit-group">

              <label>
                Price (₹) *
              </label>

              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />

            </div>


            <div className="edit-group">

              <label>
                Discount (%)
              </label>

              <input
                name="discount"
                type="number"
                min="0"
                max="100"
                value={
                  formData.discount
                }
                onChange={handleChange}
              />

            </div>


            <div className="edit-group">

              <label>
                Stock *
              </label>

              <input
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required
              />

            </div>


            <div className="edit-group">

              <label>
                Rating
              </label>

              <input
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
              />

            </div>

          </div>

        </div>


        <div className="edit-section">

          <h2>
            Product Image
          </h2>

          <div className="edit-group">

            <label>
              Image URL
            </label>

            <input
              name="image"
              type="text"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />

          </div>

          {formData.image && (
            <div className="edit-image-preview">

              <img
                src={formData.image}
                alt={formData.name}
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />

            </div>
          )}

        </div>


        <div className="edit-section">

          <h2>
            Status
          </h2>

          <label className="edit-checkbox">

            <input
              type="checkbox"
              name="isActive"
              checked={
                formData.isActive
              }
              onChange={handleChange}
            />

            <span>
              Product is active
            </span>

          </label>

        </div>


        <div className="edit-actions">

          <Link
            to="/admin/products"
            className="edit-cancel-btn"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="edit-save-btn"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default EditProduct;
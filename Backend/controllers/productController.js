import Product from "../models/Product.js";

// ==========================================
// GET ALL ACTIVE PRODUCTS
// ==========================================

export const getProducts = async (req, res) => {
  try {
    const filter = {
      isActive: true,
    };

    if (req.query.category) {
      filter.category = {
        $regex: req.query.category,
        $options: "i",
      };
    }

    const products = await Product.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products",
    });
  }
};

// ==========================================
// GET ALL PRODUCTS - ADMIN
// ==========================================

export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("GET ADMIN PRODUCTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to fetch admin products",
    });
  }
};

// ==========================================
// GET SINGLE PRODUCT
// ==========================================

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to fetch product",
    });
  }
};

// ==========================================
// GET CATEGORIES
// ==========================================

export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category", {
      isActive: true,
    });

    return res.status(200).json(categories);
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to fetch categories",
    });
  }
};

// ==========================================
// CREATE PRODUCT - ADMIN
// ==========================================

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      category,
      sku,
      price,
      discount,
      stock,
      image,
      images,
      rating,
      isActive,
    } = req.body;

    // Validate name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    // Validate category
    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product category is required",
      });
    }

    // Validate price
    if (
      price === undefined ||
      price === null ||
      Number.isNaN(Number(price)) ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid price is required",
      });
    }

    // Validate stock
    if (
      stock === undefined ||
      stock === null ||
      Number.isNaN(Number(stock)) ||
      Number(stock) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid stock is required",
      });
    }

    // Validate discount
    if (
      discount !== undefined &&
      (Number.isNaN(Number(discount)) ||
        Number(discount) < 0 ||
        Number(discount) > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "Discount must be between 0 and 100",
      });
    }

    const product = await Product.create({
      name: name.trim(),

      description: description || "",

      brand: brand || "",

      category: category.trim(),

      sku: sku || "",

      price: Number(price),

      discount:
        discount !== undefined
          ? Number(discount)
          : 0,

      stock: Number(stock),

      image: image || "",

      images: Array.isArray(images) ? images : [],

      rating:
        rating !== undefined
          ? Number(rating)
          : 4.5,

      isActive:
        isActive !== undefined
          ? Boolean(isActive)
          : true,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to create product",
    });
  }
};

// ==========================================
// UPDATE PRODUCT - ADMIN
// ==========================================

export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      category,
      sku,
      price,
      discount,
      stock,
      image,
      images,
      rating,
      isActive,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Name
    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({
          success: false,
          message: "Product name cannot be empty",
        });
      }

      product.name = String(name).trim();
    }

    // Description
    if (description !== undefined) {
      product.description = description;
    }

    // Brand
    if (brand !== undefined) {
      product.brand = brand;
    }

    // Category
    if (category !== undefined) {
      if (!String(category).trim()) {
        return res.status(400).json({
          success: false,
          message: "Category cannot be empty",
        });
      }

      product.category = String(category).trim();
    }

    // SKU
    if (sku !== undefined) {
      product.sku = sku;
    }

    // Price
    if (price !== undefined) {
      if (
        Number.isNaN(Number(price)) ||
        Number(price) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Price cannot be negative",
        });
      }

      product.price = Number(price);
    }

    // Discount
    if (discount !== undefined) {
      if (
        Number.isNaN(Number(discount)) ||
        Number(discount) < 0 ||
        Number(discount) > 100
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Discount must be between 0 and 100",
        });
      }

      product.discount = Number(discount);
    }

    // Stock
    if (stock !== undefined) {
      if (
        Number.isNaN(Number(stock)) ||
        Number(stock) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Stock cannot be negative",
        });
      }

      product.stock = Number(stock);
    }

    // Main image
    if (image !== undefined) {
      product.image = image;
    }

    // Multiple images
    if (images !== undefined) {
      product.images = Array.isArray(images)
        ? images
        : [];
    }

    // Rating
    if (rating !== undefined) {
      if (
        Number.isNaN(Number(rating)) ||
        Number(rating) < 0 ||
        Number(rating) > 5
      ) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 0 and 5",
        });
      }

      product.rating = Number(rating);
    }

    // Active status
    if (isActive !== undefined) {
      product.isActive = Boolean(isActive);
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to update product",
    });
  }
};

// ==========================================
// DELETE PRODUCT - ADMIN
// ==========================================

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Soft delete
    product.isActive = false;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to delete product",
    });
  }
};

// ==========================================
// RESTORE PRODUCT - ADMIN
// ==========================================

export const restoreProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isActive = true;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product restored successfully",
      product,
    });
  } catch (error) {
    console.error("RESTORE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to restore product",
    });
  }
};
import Product from "../models/Product.js";

// ==========================================
// GET ALL PRODUCTS
// ==========================================

export const getProducts = async (req, res) => {
  try {
    const filter = {
      isActive: true
    };

    if (req.query.category) {
      filter.category = {
        $regex: req.query.category,
        $options: "i"
      };
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 });

    return res.status(200).json(products);

  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return res.status(500).json({
      message: error.message || "Failed to fetch products"
    });
  }
};


// ==========================================
// GET ALL PRODUCTS - ADMIN
// ==========================================

export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      products
    });

  } catch (error) {
    console.error(
      "GET ADMIN PRODUCTS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to fetch admin products"
    });
  }
};


// ==========================================
// GET SINGLE PRODUCT
// ==========================================

export const getProductById = async (req, res) => {
  try {
    const product =
      await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    return res.status(200).json(product);

  } catch (error) {
    console.error(
      "GET PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to fetch product"
    });
  }
};


// ==========================================
// GET CATEGORIES
// ==========================================

export const getCategories = async (
  req,
  res
) => {
  try {
    const categories =
      await Product.distinct("category", {
        isActive: true
      });

    return res.status(200).json(
      categories
    );

  } catch (error) {
    console.error(
      "GET CATEGORIES ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to fetch categories"
    });
  }
};


// ==========================================
// CREATE PRODUCT - ADMIN
// ==========================================

export const createProduct = async (
  req,
  res
) => {
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
      isActive
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        message:
          "Product name and category are required"
      });
    }

    if (
      price === undefined ||
      price === null ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        message: "Valid price is required"
      });
    }

    if (
      stock === undefined ||
      stock === null ||
      Number(stock) < 0
    ) {
      return res.status(400).json({
        message: "Valid stock is required"
      });
    }

    const product = await Product.create({
      name: name.trim(),

      description:
        description || "",

      brand:
        brand || "",

      category:
        category.trim(),

      sku:
        sku || "",

      price:
        Number(price),

      discount:
        Number(discount) || 0,

      stock:
        Number(stock),

      image:
        image || "",

      images:
        Array.isArray(images)
          ? images
          : [],

      rating:
        Number(rating) || 4.5,

      isActive:
        isActive !== undefined
          ? Boolean(isActive)
          : true
    });

    return res.status(201).json({
      message:
        "Product created successfully",
      product
    });

  } catch (error) {
    console.error(
      "CREATE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to create product"
    });
  }
};


// ==========================================
// UPDATE PRODUCT - ADMIN
// ==========================================

export const updateProduct = async (
  req,
  res
) => {
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
      isActive
    } = req.body;

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    if (name !== undefined) {
      product.name = name.trim();
    }

    if (description !== undefined) {
      product.description =
        description;
    }

    if (brand !== undefined) {
      product.brand = brand;
    }

    if (category !== undefined) {
      product.category =
        category.trim();
    }

    if (sku !== undefined) {
      product.sku = sku;
    }

    if (price !== undefined) {
      if (Number(price) < 0) {
        return res.status(400).json({
          message:
            "Price cannot be negative"
        });
      }

      product.price =
        Number(price);
    }

    if (discount !== undefined) {
      if (
        Number(discount) < 0 ||
        Number(discount) > 100
      ) {
        return res.status(400).json({
          message:
            "Discount must be between 0 and 100"
        });
      }

      product.discount =
        Number(discount);
    }

    if (stock !== undefined) {
      if (Number(stock) < 0) {
        return res.status(400).json({
          message:
            "Stock cannot be negative"
        });
      }

      product.stock =
        Number(stock);
    }

    if (image !== undefined) {
      product.image =
        image;
    }

    if (images !== undefined) {
      product.images =
        Array.isArray(images)
          ? images
          : [];
    }

    if (rating !== undefined) {
      product.rating =
        Number(rating);
    }

    if (isActive !== undefined) {
      product.isActive =
        Boolean(isActive);
    }

    await product.save();

    return res.status(200).json({
      message:
        "Product updated successfully",
      product
    });

  } catch (error) {
    console.error(
      "UPDATE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to update product"
    });
  }
};


// ==========================================
// DELETE PRODUCT - ADMIN
// ==========================================

export const deleteProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // Soft delete
    product.isActive = false;

    await product.save();

    return res.status(200).json({
      message:
        "Product deleted successfully"
    });

  } catch (error) {
    console.error(
      "DELETE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to delete product"
    });
  }
};


// ==========================================
// RESTORE PRODUCT - ADMIN
// ==========================================

export const restoreProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    product.isActive = true;

    await product.save();

    return res.status(200).json({
      message:
        "Product restored successfully",
      product
    });

  } catch (error) {
    console.error(
      "RESTORE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to restore product"
    });
  }
};

import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  {
    name: "Masala Chilli Powder",
    description:
      "Premium masala chilli powder with rich flavor and aroma. Perfect for everyday Indian cooking.",
    brand: "HOMEKART",
    category: "Masala",
    sku: "HK-MASALA-001",
    price: 120,
    discount: 0,
    stock: 100,

    image:
      "https://images.pexels.com/photos/33440714/pexels-photo-33440714.jpeg",

    images: [],
    isActive: true,
  },

  {
    name: "Chilli Powder",
    description:
      "Quality chilli powder with rich color and authentic spicy flavor.",
    brand: "HOMEKART",
    category: "Spices",
    sku: "HK-CHILLI-001",
    price: 100,
    discount: 0,
    stock: 100,

    image:
      "https://images.pexels.com/photos/33440711/pexels-photo-33440711.jpeg",

    images: [],
    isActive: true,
  },

  {
    name: "Turmeric Powder",
    description:
      "Pure and aromatic turmeric powder for everyday cooking.",
    brand: "HOMEKART",
    category: "Spices",
    sku: "HK-TURMERIC-001",
    price: 90,
    discount: 0,
    stock: 100,

    image:
      "https://images.pexels.com/photos/6220710/pexels-photo-6220710.jpeg",

    images: [],
    isActive: true,
  },
];




const seedProducts = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log("MongoDB connected");

    // Remove existing products
    await Product.deleteMany({});

    console.log(
      "Existing products removed"
    );

    // Insert exactly 3 products
    const createdProducts =
      await Product.insertMany(products);

    console.log(
      `${createdProducts.length} HOMEKART products added successfully`
    );

    createdProducts.forEach(
      (product, index) => {
        console.log(
          `${index + 1}. ${product.name} | ₹${product.price} | Stock: ${product.stock} | Active: ${product.isActive}`
        );
      }
    );

    console.log(
      "\nHOMEKART product seeding completed."
    );

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(
      "\nSEED PRODUCTS ERROR:"
    );

    console.error(
      error.message
    );

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedProducts();


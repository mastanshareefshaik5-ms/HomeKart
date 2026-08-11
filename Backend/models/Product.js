import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    brand: {
      type: String,
      default: "",
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    sku: {
      type: String,
      default: "",
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    image: {
      type: String,
      default: ""
    },

    images: {
      type: [String],
      default: []
    },

    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);


// ==========================================
// FINAL PRICE
// ==========================================

productSchema.virtual("finalPrice").get(
  function () {
    const price = Number(this.price) || 0;
    const discount =
      Number(this.discount) || 0;

    return Number(
      (
        price -
        (price * discount) / 100
      ).toFixed(2)
    );
  }
);


productSchema.set(
  "toJSON",
  {
    virtuals: true
  }
);

productSchema.set(
  "toObject",
  {
    virtuals: true
  }
);


const Product =
  mongoose.models.Product ||
  mongoose.model(
    "Product",
    productSchema
  );

export default Product;
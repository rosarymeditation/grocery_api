const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String },
  percentageDiscount: { type: Number, default: 0 },
  weight: { type: String, default: 0 },
  image: { type: String, required: true },
  description: { type: String },
  isPopular: { type: Boolean, default: false },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  weightType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WeightType",
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

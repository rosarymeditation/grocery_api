const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: mongoose.Schema.Types.Decimal128, required: true },
  percentageDiscount: { type: Number, default: 0 },
  image: { type: String, required: true },
  quantity: { type: String },
  description: { type: String },
  isPopular: { type: Boolean, default: false },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

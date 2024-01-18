const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: { type: String },
  productId: { type: String },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;

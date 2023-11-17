const mongoose = require("mongoose");

const weightTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const WeightType = mongoose.model("WeightType", weightTypeSchema);

module.exports = WeightType;

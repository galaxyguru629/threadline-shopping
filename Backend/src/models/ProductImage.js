const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    url: { type: String, required: true },
  },
  { versionKey: false, collection: "product_images" }
);

module.exports = mongoose.model("ProductImage", productImageSchema);

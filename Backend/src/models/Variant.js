const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
  },
  { versionKey: false, collection: "variants" }
);

module.exports = mongoose.model("Variant", variantSchema);

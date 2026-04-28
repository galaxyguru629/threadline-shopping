const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    brand_id: { type: String, required: true },
    brand_name: { type: String, required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    short_description: { type: String, required: true },
    description: { type: String, required: true },
    featured_score: { type: Number, required: true },
    created_at: { type: Date, required: true },
  },
  { versionKey: false, collection: "products" }
);

module.exports = mongoose.model("Product", productSchema);

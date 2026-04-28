const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    seller_id: { type: String, required: true, index: true },
    seller_name: { type: String, required: true },
    seller_location: { type: String, required: true },
    seller_rating: { type: Number, required: true },
    seller_sales_count: { type: Number, required: true },
    variant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Variant", required: true, index: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    price: { type: Number, required: true, index: true },
    condition: { type: String, required: true, index: true },
    quantity: { type: Number, required: true },
    tags: [{ type: String, required: true }],
    note: { type: String, required: true },
  },
  { versionKey: false, collection: "listings" }
);

module.exports = mongoose.model("Listing", listingSchema);

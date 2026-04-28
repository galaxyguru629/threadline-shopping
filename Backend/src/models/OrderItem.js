const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    order_id: { type: String, required: true, index: true },
    listing_id: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { versionKey: false, collection: "order_items" }
);

module.exports = mongoose.model("OrderItem", orderItemSchema);

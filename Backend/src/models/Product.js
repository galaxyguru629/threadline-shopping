const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    sellerName: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: Number, required: true },
    salesCount: { type: Number, required: true },
    price: { type: Number, required: true },
    tags: [{ type: String, required: true }],
    note: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true },
    sizeInfo: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    featuredScore: { type: Number, required: true },
    createdAt: { type: Date, required: true },
    images: [{ type: String, required: true }],
    offers: [offerSchema],
  },
  { versionKey: false }
);

module.exports = mongoose.model("Product", productSchema);

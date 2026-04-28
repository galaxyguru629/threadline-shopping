const mongoose = require("mongoose");

const listingImageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    listing_id: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
    url: { type: String, required: true },
  },
  { versionKey: false, collection: "listing_images" }
);

module.exports = mongoose.model("ListingImage", listingImageSchema);

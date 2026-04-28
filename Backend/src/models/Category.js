const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { versionKey: false, collection: "categories" }
);

module.exports = mongoose.model("Category", categorySchema);

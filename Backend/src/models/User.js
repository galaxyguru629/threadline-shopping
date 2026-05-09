const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, default: "", trim: true },
  },
  { versionKey: false, collection: "users", timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String },
  password: { type: String, required: true }, // Consider using bcrypt for hashing
  isBrand: { type: Boolean, default: false },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", default: null },
  email: { type: String, required: true, unique: true },
  // role: { type: String, enum: ["user", "admin", "brand"], default: "user" },
  mobile: { type: String },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }],
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);

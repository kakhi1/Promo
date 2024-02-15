// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }, // Consider using bcrypt for hashing
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }],
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);

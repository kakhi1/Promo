// models/Brand.js
const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Consider using bcrypt for hashing
  offers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }],
});

module.exports = mongoose.model("Brand", brandSchema);

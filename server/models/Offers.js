const mongoose = require("mongoose");
const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
  createdAt: { type: Date, default: Date.now },
  link: { type: String, required: true },
  // Add more fields as necessary
});

module.exports = mongoose.model("Offer", offerSchema);

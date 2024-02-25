// models/Location.js
const mongoose = require("mongoose");
const sessionController = require("../controllers/sessionController");
const locationController = require("../controllers/locationController");

const locationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  country: { type: String },
  city: { type: String },
  ip: { type: String },
  // Add more fields as necessary, such as region, latitude, longitude, etc.
});

module.exports = mongoose.model("Location", locationSchema);

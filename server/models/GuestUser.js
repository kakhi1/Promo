// models/GuestUser.js
const mongoose = require("mongoose");

const guestUserSchema = new mongoose.Schema({
  age: Number,
  gender: String,
  tags: [String], // Assuming tags are an array of strings
  ipAddress: { type: String, unique: true },
});

module.exports = mongoose.model("GuestUser", guestUserSchema);

// models/GuestUser.js
const mongoose = require("mongoose");

const guestUserSchema = new mongoose.Schema({
  ipAddress: { type: String, unique: true },
  state: String,
});

module.exports = mongoose.model("GuestUser", guestUserSchema);

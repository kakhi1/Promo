// models/Session.js
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  duration: { type: Number, default: 0 }, // Duration in minutes
});

module.exports = mongoose.model("Session", sessionSchema);

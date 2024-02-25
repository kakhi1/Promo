// models/User.js
const mongoose = require("mongoose");
const sessionSchema = new mongoose.Schema(
  {
    loginTime: { type: Date, default: Date.now },
    logoutTime: { type: Date },
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String },
  password: { type: String, required: true }, // Consider using bcrypt for hashing
  isBrand: { type: Boolean, default: false },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", default: null },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }],
  isAdmin: { type: Boolean, default: false },
  sessions: [sessionSchema], // Tracks each session's start and end
  location: locationSchema, // Stores the user's last known location
  emailVerified: { type: Boolean, default: false },
});

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   username: { type: String },
//   password: { type: String, required: true }, // Consider using bcrypt for hashing
//   isBrand: { type: Boolean, default: false },
//   brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", default: null },
//   email: { type: String, required: true, unique: true },
//   mobile: { type: String },
//   favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }],
//   isAdmin: { type: Boolean, default: false },
//   lastActive: { type: Date, default: Date.now },
// });

module.exports = mongoose.model("User", userSchema);

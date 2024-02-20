const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  description: String,
  tags: [String],
  category: String,
  url: String,
  state: [String],
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }, // Default timestamp for document creation
  status: { type: String, default: "active" }, // Default status for new brands
  lastModified: { type: Date, default: Date.now }, // To be updated on every document modification
});

// Hash the password before saving
brandSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  // Update lastModified field to current date on every save
  this.lastModified = Date.now();

  next();
});

// Example virtual for a computed property (not stored in DB)
// Note: This is just a demonstration and assumes the existence of firstName and lastName fields
brandSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("Brand", brandSchema);

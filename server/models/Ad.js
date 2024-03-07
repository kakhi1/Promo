// models/Ad.js
const mongoose = require("mongoose");
const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrlDesktop: { type: String, required: true },
  imageUrlMobile: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  link: { type: String, required: true },
  active: { type: Boolean, default: true }, // New field to manually set ad active/inactive
  pages: [
    {
      type: String,
      required: true,
      enum: ["home", "brand", "userarea"], // Restrict pages to specific values
    },
  ],
});

module.exports = mongoose.model("Ad", adSchema);

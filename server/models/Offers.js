// const mongoose = require("mongoose");

// const offerSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: false },
//   // brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true }, // Reference to the Brand model
//   createdAt: { type: Date, default: Date.now }, // Automatically sets the date when the offer is created
//   category: [String],
//   state: [String],
//   url: String,
//   tags: [String], // Optional: Similar to Brand, you might want to tag offers for categorization
//   imageUrls: [{ type: String }], // Optional: If you want to include an image with the offer
//   views: { type: Number, default: 0 },
//   visits: { type: Number, default: 0 }, // Track the number of clicks offers urls
//   shares: { type: Number, default: 0 },
//   brand: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Brand",
//     required: true,
//   },
//   status: {
//     type: String,
//     default: "pending",
//     enum: ["pending", "approved", "rejected"],
//   },
//   // originalPrice: { type: Number, required: true }, // Added field for original price
//   // discountPrice: { type: Number },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" }, // Optional: If you want to track the status of offers
//   lastModified: { type: Date, default: Date.now }, // To track when an offer was last updated
//   numberField: {
//     type: Number,
//     validate: {
//       validator: function (value) {
//         // If value is provided, it must be between 1 and 100
//         return value == null || (value >= 1 && value <= 100);
//       },
//       message: "Number must be between 1 and 100",
//     },
//     required: false, // Field is optional
//   },
// });

// // Optionally, you can add methods or virtuals to your schema if needed
// // For instance, a method to format the createdAt date in a more readable form

// offerSchema.methods.formattedDate = function () {
//   return this.createdAt.toDateString(); // Example method to format date
// };

// module.exports = mongoose.model("Offer", offerSchema);
const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  category: [String],
  state: [String],
  url: String,
  tags: [String],
  imageUrls: [{ type: String }],
  views: { type: Number, default: 0 },
  visits: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "approved", "rejected"],
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
  lastModified: { type: Date, default: Date.now },
  numberField: {
    type: Number,
    validate: {
      validator: function (value) {
        return value == null || (value >= 1 && value <= 100);
      },
      message: "Number must be between 1 and 100",
    },
    required: false,
  },
  viewIPs: [String], // Field to store IP addresses
});

offerSchema.methods.formattedDate = function () {
  return this.createdAt.toDateString();
};

module.exports = mongoose.model("Offer", offerSchema);

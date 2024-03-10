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
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
  },
});

async function getSuggestedBrandsForUser(userId) {
  // Step 1: Find the user's favorite offers and aggregate their tags and categories
  const userWithFavorites = await User.findById(userId)
    .populate("favorites")
    .exec();

  if (!userWithFavorites) {
    return []; // User not found or has no favorites
  }

  const favoriteTagsAndCategories = userWithFavorites.favorites.reduce(
    (acc, offer) => {
      acc.tags = [...new Set([...acc.tags, ...offer.tags])]; // Assuming offer has a 'tags' array
      if (offer.category && !acc.categories.includes(offer.category)) {
        acc.categories.push(offer.category); // Assuming offer has a 'category' property
      }
      return acc;
    },
    { tags: [], categories: [] }
  );

  // Step 2: Use the aggregated tags and categories to find matching brands
  // This query assumes brands have 'tags' and 'category' fields similar to offers
  const suggestedBrands = await Brand.find({
    $or: [
      { tags: { $in: favoriteTagsAndCategories.tags } },
      { category: { $in: favoriteTagsAndCategories.categories } },
    ],
  })
    .limit(8)
    .exec(); // Limit to 8 brands

  return suggestedBrands;
}

module.exports = mongoose.model("User", userSchema);

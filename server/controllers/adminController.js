const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Brand = require("../models/Brand");
const Offer = require("../models/Offer");
const Ad = require("../models/Ad");
const Analytics = require("../models/Analytics"); // Assuming you have this model

// Admin uploading an ad
exports.uploadAd = async (req, res) => {
  const { title, imageUrl, link } = req.body;
  try {
    const newAd = new Ad({ title, imageUrl, link });
    await newAd.save();
    res.json({ message: "Ad uploaded successfully", ad: newAd });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading ad", error: error.message });
  }
};

// Admin changing brand password
exports.changeBrandPassword = async (req, res) => {
  const { brandId, newPassword } = req.body;
  try {
    const brand = await Brand.findById(brandId);
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    const salt = await bcrypt.genSalt(10);
    brand.password = await bcrypt.hash(newPassword, salt);
    await brand.save();
    res.json({ message: "Brand password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating brand password", error: error.message });
  }
};

// Admin confirming offer upload
exports.confirmOffer = async (req, res) => {
  const { offerId } = req.body;
  try {
    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    offer.confirmed = true; // Assuming there's a 'confirmed' field in your Offer model
    await offer.save();
    res.json({ message: "Offer confirmed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error confirming offer", error: error.message });
  }
};

// Analytics for all brands (Example: Count offers per brand)
exports.brandAnalytics = async (req, res) => {
  try {
    const analytics = await Brand.aggregate([
      {
        $lookup: {
          from: "offers",
          localField: "_id",
          foreignField: "brand",
          as: "offers",
        },
      },
      {
        $project: {
          name: 1,
          offerCount: { $size: "$offers" },
        },
      },
    ]);
    res.json(analytics);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving brand analytics",
        error: error.message,
      });
  }
};

// Individual offer analytics could be similar, focusing on specific metrics per offer

const Offer = require("../models/Offers");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const Brand = require("../models/Brand");

exports.incrementOfferViews = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!offer) {
      return res.status(404).json({ success: false, error: "Offer not found" });
    }
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createOffer = async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Request Files:", req.files);
  try {
    if (req.fileValidationError) {
      return res
        .status(400)
        .json({ success: false, error: req.fileValidationError });
    }
    let tags = req.body.tags ? parseInput(req.body.tags) : [];
    let state = req.body.state ? parseInput(req.body.state) : [];
    const { originalPrice, discountPrice, brand } = req.body;

    // Adjusting for multiple files; map each file to its path
    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    const offerData = {
      ...req.body,
      tags, // Use parsed tags
      state, // Use parsed state
      imageUrls,
      originalPrice,
      discountPrice,
      isApproved: false,
      brand,
    };

    // Optionally remove properties if not part of your model

    // Create the offer with the brand linked
    const newOffer = await Offer.create(offerData);
    // If `brand` is provided, update the Brand document to include this new offer
    if (brand) {
      // Make sure `brand` is the correct ObjectId format
      await Brand.findByIdAndUpdate(
        brand, // Use `brand` as the ID directly
        { $push: { offers: newOffer._id } }, // Pushing the offer ID to the brand's offers array
        { new: true, safe: true, upsert: false } // Options for findByIdAndUpdate
      );
    }
    res.status(201).json({ success: true, data: newOffer });
  } catch (error) {
    console.error("Error creating offer:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// Helper function to parse input to array format
function parseInput(input) {
  if (Array.isArray(input)) {
    return input; // Already an array, return as is
  } else if (typeof input === "string") {
    try {
      // Attempt to parse as JSON array
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        return parsed; // Successfully parsed JSON array
      } else {
        return [parsed]; // Parsed single value, return as array
      }
    } catch (error) {
      // Not a JSON string, treat as single string value
      return [input]; // Return as array with single item
    }
  } else {
    return []; // Unsupported type, return empty array
  }
}

exports.approveOfferById = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      { $set: { isApproved: true } },
      { new: true, runValidators: true }
    );
    if (!offer) {
      return res
        .status(404)
        .json({ success: false, error: "Offer not found or already approved" });
    }
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Optionally, a function to reject an offer
exports.rejectOfferById = async (req, res) => {
  try {
    // Assuming deletion is equivalent to rejection in this context
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({
        success: false,
        error: "Offer not found or already processed",
      });
    }
    res.status(200).json({
      success: true,
      message: "Offer rejected and deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all offers
// exports.getAllOffers = async (req, res) => {
//   try {
//     const brandId = req.query.brandId;
//     const query = brandId ? { brand: brandId } : {};
//     const offers = await Offer.find();
//     res.status(200).json({ success: true, data: offers });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };
exports.getAllOffers = async (req, res) => {
  try {
    const brandId = req.query.brandId;
    let query = {};

    if (brandId) {
      query = { brand: brandId, status: "approved" }; // Assuming status field tracks approval
    } else {
      query = { status: "approved" };
    }

    const offers = await Offer.find(query);
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get a single offer by ID
exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, error: "Offer not found" });
    }
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update an offer by ID
exports.updateOfferById = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!offer) {
      return res.status(404).json({ success: false, error: "Offer not found" });
    }
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete an offer by ID
exports.deleteOfferById = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, error: "Offer not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

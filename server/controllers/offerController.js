// const Offer = require("../models/offers"); // Adjust the path as necessary

// // Create a new offer
// // Adjusted to set the offer as pending approval when created by a brand
// exports.createOffer = async (req, res) => {
//   console.log("Creating offer with data:", req.body); // Log incoming request data
//   const offerData = {
//     ...req.body,
//     isApproved: false, // Assuming you have an isApproved field
//     // or status: 'pending', if you're using a status field
//   };
//   try {
//     const newOffer = await Offer.create(offerData);
//     console.log("Offer created, pending approval:", newOffer);
//     res.status(201).json({ success: true, data: newOffer });
//   } catch (error) {
//     console.error("Error creating offer:", error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };
const Offer = require("../models/offers");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

exports.createOffer = async (req, res) => {
  try {
    // Parse tags and state from JSON strings, if provided
    let tags = [],
      state = [];
    if (req.body.tags && req.body.tags.startsWith("[")) {
      tags = JSON.parse(req.body.tags);
    }
    if (req.body.state && req.body.state.startsWith("[")) {
      state = JSON.parse(req.body.state);
    }

    const imageUrl = req.file ? req.file.path : ""; // Handle file upload

    // Construct the offer data, incorporating parsed fields and the image URL
    const offerData = {
      ...req.body,
      tags,
      state,
      imageUrl,
      isApproved: false, // Example field, assuming offers require approval
    };

    // Remove fields that should not be directly copied
    delete offerData.tags;
    delete offerData.state;

    // Log the final offer data being created (for debugging purposes)
    console.log("Creating offer with data:", offerData);

    // Create the offer in the database
    const newOffer = await Offer.create(offerData);
    console.log("Offer created, pending approval:", newOffer);

    // Respond with success and the created offer data
    res.status(201).json({ success: true, data: newOffer });
  } catch (error) {
    console.error("Error creating offer:", error);
    // If parsing JSON fails, it will also be caught here
    res.status(400).json({ success: false, error: error.message });
  }
};

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
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
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

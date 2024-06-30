const mongoose = require("mongoose");
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
    let category = req.body.category ? parseInput(req.body.category) : [];
    const { brand, description, url, numberField } = req.body;

    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    const offerData = {
      ...req.body,
      tags, // Use parsed tags
      state, // Use parsed state
      imageUrls,
      category,
      isApproved: false,
      brand,
    };

    if (!description) {
      delete offerData.description;
    }
    if (!url) {
      delete offerData.url;
    }
    if (
      !numberField ||
      isNaN(numberField) ||
      numberField < 1 ||
      numberField > 100
    ) {
      delete offerData.numberField;
    }

    const newOffer = await Offer.create(offerData);

    if (brand) {
      await Brand.findByIdAndUpdate(
        brand,
        { $push: { offers: newOffer._id } },
        { new: true, safe: true, upsert: false }
      );
    }

    res.status(201).json({ success: true, data: newOffer });
  } catch (error) {
    console.error("Error creating offer:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateOfferById = async (req, res) => {
  try {
    // Fetch the existing offer
    const existingOffer = await Offer.findById(req.params.id);
    if (!existingOffer) {
      return res.status(404).json({ success: false, error: "Offer not found" });
    }

    let tags = [];
    let state = [];
    let category = [];

    // Try to parse tags, state, and category from the request body
    try {
      tags = req.body.tags
        ? JSON.parse(req.body.tags).map((tag) => tag.value)
        : [];
    } catch (error) {
      console.error("Error parsing tags:", error.message);
    }

    try {
      state = req.body.state
        ? JSON.parse(req.body.state).map((state) => state.value)
        : [];
    } catch (error) {
      console.error("Error parsing state:", error.message);
    }

    try {
      category = req.body.category
        ? JSON.parse(req.body.category).map((cat) => cat.value)
        : [];
    } catch (error) {
      console.error("Error parsing category:", error.message);
    }

    // Prepare the update data with parsed tags, state, and category
    let updateData = { ...req.body, tags, state, category };

    // Remove the stringified fields that were parsed and replaced
    delete updateData["tags"];
    delete updateData["state"];
    delete updateData["category"];

    console.log(
      "Constructed updateData before adjusting status and images:",
      updateData
    );

    // Adjust status based on user role
    if (req.body.role === "admin") {
      updateData.status = "approved";
    } else if (req.body.role === "brand") {
      updateData.status = "pending";
    }

    // Update image URLs if files were uploaded
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map((file) => file.path);
      updateData.imageUrls = imageUrls;
      console.log("Updated imageUrls with uploaded files:", imageUrls);
    }

    // If numberField is already set, do not include it in the update unless it's provided
    if (existingOffer.numberField && !req.body.numberField) {
      delete updateData.numberField;
    }

    console.log(
      "Final updateData being used for update operation:",
      updateData
    );

    const offer = await Offer.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!offer) {
      console.log("No offer found with the given ID.");
      return res.status(404).json({ success: false, error: "Offer not found" });
    }

    console.log("Successfully updated offer:", offer);
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    console.error("Error updating offer:", error);
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

exports.getAllOffers = async (req, res) => {
  try {
    const { brandId, category, tags, search } = req.query;
    let query = { status: "approved" };

    if (brandId) {
      query.brand = brandId;
    }

    if (category) {
      query.category = category;
    }

    if (tags) {
      const tagsArray = tags.split(",");
      query.tags = { $in: tagsArray };
    }

    // Include search by name (title) if 'search' query parameter is provided
    if (search) {
      query.title = { $regex: search, $options: "i" }; // 'i' option makes it case insensitive
    }

    const offers = await Offer.find(query);
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getAllOffersWithoutFilter = async (req, res) => {
  try {
    const offers = await Offer.find({});
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

exports.getOffersByBrand = async (req, res) => {
  const { brandId } = req.params;
  const sortViews = req.query.sort;

  try {
    // Build the query object to filter offers by brandId
    let query = Offer.find({ brand: brandId });

    // If 'sort=views' is specified, sort the results by views
    if (sortViews === "views") {
      query = query.sort({ views: -1 }); // Sort by views in descending order
    }

    const offers = await query.exec();

    if (!offers.length) {
      return res
        .status(404)
        .json({ message: "No offers found for this brand." });
    }

    res.json(offers);
  } catch (error) {
    console.error("Error fetching offers by brand:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
exports.getSuggestedOffers = async (req, res) => {
  const { offerId } = req.params;
  try {
    const referenceOffer = await Offer.findById(offerId).select(
      "state tag category"
    );

    if (!referenceOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // Ensure values passed to $in are arrays, defaulting to an empty array if undefined
    const stateArray = Array.isArray(referenceOffer.state)
      ? referenceOffer.state.map((id) => new mongoose.Types.ObjectId(id))
      : [];
    const tagArray = Array.isArray(referenceOffer.tag)
      ? referenceOffer.tag
      : [];

    let suggestedOffers = await Offer.find({
      _id: { $ne: offerId },
      ...(stateArray.length && { state: { $in: stateArray } }),
      ...(tagArray.length && { tag: { $in: tagArray } }),
      category: referenceOffer.category,
    }).limit(12);

    // Additional fallback queries if suggestedOffers is empty...

    return res.status(200).json(suggestedOffers);
  } catch (error) {
    console.error(
      `Error fetching suggested offers for offerId: ${offerId}`,
      error
    );
    return res.status(500).json({
      message: "Error fetching suggested offers",
      error: error.message,
    });
  }
};
// Controller to increment the share count for an offer
exports.addShare = async (req, res) => {
  const { offerId } = req.params;

  try {
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // Increment the shares count and save the document
    offer.shares += 1;
    await offer.save();

    res.json({
      message: "Offer share count incremented successfully",
      shares: offer.shares,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error incrementing offer's share count",
      error: error.message,
    });
  }
};

// Controller to fetch the share count for an offer
exports.fetchShares = async (req, res) => {
  const { offerId } = req.params;

  try {
    const offer = await Offer.findById(offerId, "shares");
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.json({ shares: offer.shares });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching offer's shares", error: error.message });
  }
};

// click count for each  offers
exports.incrementOfferVisits = async (req, res) => {
  try {
    const offerId = req.params.id;
    await Offer.findByIdAndUpdate(offerId, { $inc: { visits: 1 } });
    res.send({ message: "Offer visit counted successfully." });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// get all  views, shares, clicks

exports.countAllMetrics = async (req, res) => {
  try {
    const metrics = await Offer.aggregate([
      {
        $group: {
          _id: null, // Group by null to aggregate over the entire collection
          totalViews: { $sum: "$views" },
          totalShares: { $sum: "$shares" },
          totalVisits: { $sum: "$visits" },
        },
      },
    ]);

    // The aggregate operation returns an array, so we take the first element
    if (metrics.length > 0) {
      res.status(200).json({
        success: true,
        data: metrics[0],
      });
    } else {
      res.status(404).json({
        success: false,
        error: "No metrics found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

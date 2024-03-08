const mongoose = require("mongoose");
const Offer = require("../models/Offers");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const Brand = require("../models/Brand");

function parseInput(input) {
  if (!input) return [];
  return Array.isArray(input) ? input : JSON.parse(input);
}

// Util function to parse inputs that might be arrays or single values
function parseInput(input) {
  return Array.isArray(input) ? input : [input];
}

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
// exports.getAllOffers = async (req, res) => {
//   try {
//     const { brandId, category, tags } = req.query;
//     let query = { status: "approved" };

//     if (brandId) {
//       query.brand = brandId;
//     }

//     if (category) {
//       query.category = category;
//     }

//     if (tags) {
//       const tagsArray = tags.split(",");
//       query.tags = { $in: tagsArray };
//     }

//     const offers = await Offer.find(query);
//     res.status(200).json({ success: true, data: offers });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

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

// Update an offer by ID
exports.updateOfferById = async (req, res) => {
  try {
    console.log("Updating offer with ID:", req.params.id);
    console.log("Initial req.body:", req.body);
    console.log("Initial req.files:", req.files);

    // Assuming req.body.tags and req.body.state are JSON strings of arrays
    let tags = JSON.parse(req.body.tags).map((tag) => tag.value);
    let state = JSON.parse(req.body.state).map((state) => state.value);

    console.log("Parsed tags:", tags);
    console.log("Parsed state:", state);

    // Prepare the update data with parsed tags and state,
    // spread the rest of req.body to retain other fields as they were
    let updateData = { ...req.body, tags, state };
    // Remove the stringified fields that were parsed and replaced
    delete updateData["tags"];
    delete updateData["state"];

    // Add parsed tags and state to the updateData
    updateData.tags = tags;
    updateData.state = state;

    console.log(
      "Constructed updateData before adjusting status and images:",
      updateData
    );

    // if (req.user && req.user.role === "brand") {
    //   updateData.status = "pending";
    //   console.log("Status set to pending due to brand role");
    // }
    // If the user is an admin, approve the offer directly
    if (req.body.role === "admin") {
      updateData.status = "approved";
    } else if (req.body.role === "brand") {
      updateData.status = "pending";
    }

    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map((file) => file.path);
      updateData.imageUrls = imageUrls;
      console.log("Updated imageUrls with uploaded files:", imageUrls);
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

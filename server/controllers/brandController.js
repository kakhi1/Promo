const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Import the User model
const Brand = require("../models/Brand");
const Offer = require("../models/Offers");

exports.createBrand = async (req, res) => {
  try {
    const { name, email, password, description, category, url } = req.body;
    const tags = JSON.parse(req.body.tags || "[]");
    const state = JSON.parse(req.body.state || "[]");
    const imageUrl = req.file ? req.file.path : "";

    // Check if the email is already in use
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "ეს იმეილი უკვე გამოყენებულია, სცადეთ სხვა იმეილი" });
    }
    // Check if the brand name is already in use
    const existingBrand = await Brand.findOne({ name }).lean();
    if (existingBrand) {
      return res
        .status(400)
        .json({ message: "ბრენდი ამ სახელით უკვე არსებობს" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const brand = new Brand({
      name,
      email,
      password: hashedPassword,
      description,
      tags,
      category,
      url,
      state,
      imageUrl,
    });
    await brand.save();
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isBrand: true,
      brand: brand._id, // Link to the brand document
    });
    await user.save();

    res.status(201).json({
      message: "Brand and user created successfully",
      brandId: brand._id,
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating brand", error: error.message });
  }
};

exports.getBrandByOfferId = async (req, res) => {
  try {
    const { offersId } = req.params;
    const offer = await Offer.findById(offersId).populate("brand");
    if (!offer) {
      return res.status(404).send("Offer not found");
    }

    // Check if offer has a brand populated
    if (!offer.brand) {
      return res.status(404).send("Brand not found for this offer");
    }

    const brand = await Brand.findById(offer.brand._id);
    // Since we already checked if offer.brand is null, this check might be redundant
    // unless you want to double-check that the brand document exists
    if (!brand) {
      return res.status(404).send("Brand not found");
    }

    res.json(brand);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// exports.getBrandById = async (req, res) => {
//   try {
//     const { brandId } = req.params; // Extract brandId from request parameters
//     const brand = await Brand.findById(brandId).populate("offers"); // Populate the offers if they are referenced in the Brand model

//     if (!brand) {
//       return res.status(404).json({ message: "Brand not found" });
//     }

//     res.json(brand); // Send back the found brand with its details and offers
//   } catch (error) {
//     console.error("Error fetching brand details:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching brand details", error: error.message });
//   }
// };

exports.getBrandById = async (req, res) => {
  try {
    const { brandId } = req.params; // Extract brandId from request parameters

    // Validate brandId: check if it is not undefined and is a valid ObjectId
    if (!brandId || !mongoose.Types.ObjectId.isValid(brandId)) {
      return res.status(400).json({ message: "Invalid or missing brand ID" });
    }

    const brand = await Brand.findById(brandId).populate("offers"); // Populate the offers if they are referenced in the Brand model
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json(brand); // Send back the found brand with its details and offers
  } catch (error) {
    console.error("Error fetching brand details:", error);
    res
      .status(500)
      .json({ message: "Error fetching brand details", error: error.message });
  }
};

exports.getBrands = async (req, res) => {
  try {
    const matchStage = {};

    // Search functionality - only by name
    if (req.query.search) {
      const searchQuery = req.query.search;
      matchStage.name = { $regex: searchQuery, $options: "i" }; // Case-insensitive regex search
    }

    // Filtering by category
    if (req.query.category) {
      matchStage.category = req.query.category;
    }

    // Filtering by tag
    if (req.query.tag) {
      matchStage.tags = req.query.tag;
    }

    const brandsWithOfferCount = await Brand.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "offers",
          localField: "_id",
          foreignField: "brand",
          as: "offers",
        },
      },
      {
        $addFields: {
          offerCount: { $size: "$offers" },
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          description: 1,
          tags: 1, // Returning all tags
          category: 1,
          url: 1,
          state: 1,
          imageUrl: 1,
          offerCount: 1,
        },
      },
    ]);

    res.json({ success: true, data: brandsWithOfferCount });
  } catch (error) {
    console.error("Failed to fetch brands with offer count:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.findOffersByViews = async (req, res) => {
  try {
    const brandId = req.params.brandId;

    // Find the brand and populate only approved offers
    const brand = await Brand.findById(brandId)
      .populate({
        path: "offers",
        match: { status: "approved" }, // Only get offers that are approved
      })
      .exec();

    if (!brand) {
      return res.status(404).send({ message: "Brand not found" });
    }

    // Offers are now filtered by approved status, next, sort them by views
    const sortedOffers = brand.offers.sort((a, b) => b.views - a.views);

    res.json(sortedOffers);
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving offers for the brand",
      error: error.message,
    });
  }
};

exports.findAllOffersByViews = async (req, res) => {
  try {
    // Find all brands and populate their offers
    const brands = await Brand.find().populate("offers").exec();

    // Sort offers of each brand by views in descending order
    brands.forEach((brand) => {
      brand.offers.sort((a, b) => b.views - a.views);
    });

    // Create a response object that includes each brand with its sorted offers
    const response = brands.map((brand) => ({
      brandId: brand._id,
      brandName: brand.name,
      sortedOffers: brand.offers,
    }));

    res.json(response);
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving offers for all brands",
      error: error.message,
    });
  }
};

// exports.getSuggestedBrands = async (req, res) => {
//   const { brandId } = req.params;
//   try {
//     const referenceBrand = await Brand.findById(brandId).select(
//       "state tags category"
//     );

//     if (!referenceBrand) {
//       return res.status(404).json({ message: "Brand not found" });
//     }

//     // Ensure values passed to $in are arrays, defaulting to an empty array if undefined
//     const stateArray = Array.isArray(referenceBrand.state)
//       ? referenceBrand.state
//       : [];
//     const tagArray = Array.isArray(referenceBrand.tags)
//       ? referenceBrand.tags
//       : [];

//     let suggestedBrands = await Brand.find({
//       _id: { $ne: brandId },
//       ...(stateArray.length && { state: { $in: stateArray } }),
//       ...(tagArray.length && { tags: { $in: tagArray } }),
//       category: referenceBrand.category,
//     }).limit(12);

//     // You might consider additional logic or fallbacks similar to what was noted for offers

//     return res.status(200).json(suggestedBrands);
//   } catch (error) {
//     console.error(
//       `Error fetching suggested brands for brandId: ${brandId}`,
//       error
//     );
//     return res.status(500).json({
//       message: "Error fetching suggested brands",
//       error: error.message,
//     });
//   }
// };

exports.getSuggestedBrands = async (req, res) => {
  const { brandId } = req.params;
  try {
    const referenceBrand = await Brand.findById(brandId).select(
      "state tags category"
    );
    if (!referenceBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    let aggregation = Brand.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(brandId) }, // Correct usage of ObjectId
        },
      },
      {
        $addFields: {
          stateMatch: {
            $cond: {
              if: {
                $in: [
                  "$state",
                  Array.isArray(referenceBrand.state)
                    ? referenceBrand.state
                    : [referenceBrand.state],
                ],
              },
              then: 1,
              else: 0,
            },
          },
          tagsMatch: {
            $cond: {
              if: {
                $setIsSubset: [
                  Array.isArray(referenceBrand.tags)
                    ? referenceBrand.tags
                    : [referenceBrand.tags],
                  "$tags",
                ],
              },
              then: 1,
              else: 0,
            },
          },
          categoryMatch: {
            $cond: {
              if: { $eq: ["$category", referenceBrand.category] },
              then: 1,
              else: 0,
            },
          },
        },
      },
      {
        $addFields: {
          totalMatch: { $sum: ["$stateMatch", "$tagsMatch", "$categoryMatch"] },
        },
      },
      {
        $sort: {
          totalMatch: -1,
          stateMatch: -1,
          tagsMatch: -1,
          categoryMatch: -1,
        },
      },
      {
        $limit: 12,
      },
    ]);

    let suggestedBrands = await aggregation.exec();

    return res.status(200).json(suggestedBrands);
  } catch (error) {
    console.error(
      `Error fetching suggested brands for brandId: ${brandId}`,
      error
    );
    return res.status(500).json({
      message: "Error fetching suggested brands",
      error: error.message,
    });
  }
};

exports.updateBrandById = async (req, res) => {
  try {
    let { email, password, tags, state } = req.body;
    const brandId = req.params.id;

    // Parsing tags and state from JSON strings, if necessary
    try {
      tags = tags ? JSON.parse(tags) : undefined;
      state = state ? JSON.parse(state) : undefined;
    } catch (error) {
      // If parsing fails, log the error and potentially keep the original format or handle as needed
      console.error("Parsing error for tags or state:", error);
    }

    // Find the associated user using the brand ID stored in the user document
    const user = await User.findOne({ brand: brandId });
    if (!user) {
      return res.status(404).json({ message: "Associated user not found" });
    }

    // Prepare the fields to update for the user
    let userUpdateFields = {};
    if (email && email !== user.email) {
      // Check if the new email is already in use by another user
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          message: "Email already in use. Please use a different email.",
        });
      }
      userUpdateFields.email = email;
    }
    if (password) {
      userUpdateFields.password = await bcrypt.hash(password, 12);
    }

    // Apply updates to the user
    await User.findByIdAndUpdate(user._id, userUpdateFields, { new: true });

    // Prepare the update data for the brand, excluding email and password
    let updateData = {
      ...req.body,
      tags,
      state,
      email: undefined,
      password: undefined,
    };
    // Correcting the image URL format
    // If there's an image file, add its path to updateData
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }
    // Update the brand
    const updatedBrand = await Brand.findByIdAndUpdate(brandId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.status(200).json({
      message: "Brand and associated user updated successfully",
      data: updatedBrand,
    });
  } catch (error) {
    console.error("Error updating brand and associated user:", error);
    res.status(500).json({
      message: "Error updating brand and associated user",
      error: error.message,
    });
  }
};

exports.deleteBrandById = async (req, res) => {
  try {
    const { id } = req.params; // Get the brand ID from the request parameters

    // Optional: Check if the brand exists before attempting to delete
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    // Delete the brand
    await Brand.findByIdAndDelete(id);

    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res
      .status(500)
      .json({ message: "Error deleting brand", error: error.message });
  }
};

exports.getBrandMetrics = async (req, res) => {
  const { brandId } = req.params; // Get brandId from the URL parameters

  try {
    const metrics = await Offer.aggregate([
      { $match: { brand: new mongoose.Types.ObjectId(brandId) } }, // Use 'new' here
      {
        $group: {
          _id: "$brand",
          totalShares: { $sum: "$shares" },
          totalViews: { $sum: "$views" },
          totalVisits: { $sum: "$visits" },
        },
      },
    ]);

    if (metrics.length > 0) {
      res.json(metrics[0]);
    } else {
      res
        .status(404)
        .json({ message: "Metrics not found for the given brand" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// count favorites each band

exports.getOffersWithFavoritesCount = async (req, res) => {
  const { brandId } = req.params; // Assuming brandId is passed in the URL

  try {
    const offers = await Offer.find({ brand: brandId });

    const offersWithCount = await Promise.all(
      offers.map(async (offer) => {
        const favoritesCount = await User.countDocuments({
          favorites: offer._id,
        });
        return {
          ...offer.toObject(), // Convert the mongoose document to a plain JavaScript object
          favoritesCount,
        };
      })
    );

    res.status(200).json({ success: true, data: offersWithCount });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch offers and their favorites count",
      error: error.message,
    });
  }
};

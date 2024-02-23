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
  console.log(`Fetching brand for offer ID: ${req.params.offersId}`);
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
    console.log("Brand data:", brand);
    res.json(brand);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.getBrands = async (req, res) => {
  try {
    const brandsWithOfferCount = await Brand.aggregate([
      {
        $lookup: {
          from: "offers", // Ensure this matches your offers collection name
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
          tags: 1,
          category: 1,
          url: 1,
          state: 1,
          imageUrl: 1,
          offerCount: 1,
        },
      },
    ]);

    res.json({ success: true, data: brandsWithOfferCount });
    console.log(brandsWithOfferCount);
  } catch (error) {
    console.error("Failed to fetch brands with offer count:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Import the User model
const Brand = require("../models/Brand");

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

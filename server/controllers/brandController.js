const bcrypt = require("bcryptjs");
const Brand = require("../models/Brand");

exports.createBrand = async (req, res) => {
  try {
    const { name, email, password, description, category, url } = req.body;
    const tags = JSON.parse(req.body.tags || "[]");
    const state = JSON.parse(req.body.state || "[]");
    const imageUrl = req.file ? req.file.path : "";

    const existingBrand = await Brand.findOne({ email });
    if (existingBrand) {
      return res
        .status(400)
        .json({ message: "Brand already exists with this email." });
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
    res
      .status(201)
      .json({ message: "Brand created successfully", brandId: brand._id });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating brand", error: error.message });
  }
};

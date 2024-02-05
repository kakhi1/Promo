const bcrypt = require("bcryptjs");
const Brand = require("../models/Brand");

exports.createBrand = async (req, res) => {
  try {
    const { name, login, password } = req.body;

    // Check if brand already exists
    let brand = await Brand.findOne({ login });
    if (brand) {
      return res.status(400).json({ message: "Brand already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new brand
    brand = new Brand({
      name,
      login,
      password: hashedPassword,
    });

    await brand.save();
    res.status(201).json({ message: "Brand created successfully", brand });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating brand", error: error.message });
  }
};

// controllers/userController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Brand = require("../models/Brand");

// Assuming this function is defined to check both User and Brand collections
async function emailExists(email) {
  const userExists = await User.findOne({ email }).lean();
  const brandExists = await Brand.findOne({ email }).lean();
  return userExists || brandExists ? true : false;
}

exports.register = async (req, res) => {
  try {
    const { name, username, email, password, mobile } = req.body;

    // Check if user already exists
    if (await emailExists(email)) {
      return res
        .status(400)
        .json({ message: "ეს იმეილი უკვე გამოყენებულია, სცადეთ სხვა იმეილი" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      name,
      username,
      email,
      password: hashedPassword,
      mobile,
    });

    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Attempting login for:", email);
  try {
    let user = await User.findOne({ email });

    if (!user) {
      console.log("Email not found:", email);
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Determine the role based on user document flags
    let role = "user"; // Default role
    if (user.isAdmin) {
      role = "admin";
    } else if (user.isBrand) {
      role = "brand";
    }

    const token = jwt.sign({ userId: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const responseObj = {
      message: "Logged in successfully",
      entity: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role, // Reflects the determined role
      },
      token,
    };

    res.status(200).json(responseObj);
    console.log("Sending login response:", responseObj);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

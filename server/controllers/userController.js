// controllers/userController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { name, username, email, password, mobile } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
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
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid Credentials" });
//     }

//     // Validate password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid Credentials" });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user._id }, // Payload to include in the token
//       process.env.JWT_SECRET, // Secret key from your .env file
//       { expiresIn: "1h" } // Options, setting token expiration
//     );

//     // Respond with user data (excluding sensitive information like password) and JWT token
//     res.status(200).json({
//       message: "Logged in successfully",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         // Include any other non-sensitive user information you want to return
//       },
//       token, // Send the token to the client
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error logging in", error: error.message });
//   }
// };
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin }, // Include isAdmin in the JWT payload
      process.env.JWT_SECRET, // Secret key from your .env file
      { expiresIn: "1h" } // Options, setting token expiration
    );

    // Respond with user data (excluding sensitive information like password) and JWT token
    res.status(200).json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin, // Include isAdmin property
        // Include any other non-sensitive user information you want to return
      },
      token, // Send the token to the client
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

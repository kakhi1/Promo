// controllers/userController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Brand = require("../models/Brand");

const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is set in your environment

// exports.verifyToken = (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1]; // Extract token from authorization header

//   if (!token) {
//     return res.status(401).json({ message: "Token is required" });
//   }

//   jwt.verify(token, JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: "Invalid or expired token" });
//     }

//     // Token is valid
//     res.json({
//       message: "Token is valid",
//       userId: decoded.userId,
//       role: decoded.role,
//     });
//   });
// };
exports.verifyToken = (req, res) => {
  console.log("Verifying token...");

  const token = req.headers.authorization?.split(" ")[1]; // Extract token from authorization header

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Token is required" });
  }

  console.log("Token received:", token);

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Error verifying token:", err);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    console.log("Token is valid:", decoded);

    // Token is valid
    res.json({
      message: "Token is valid",
      userId: decoded.userId,
      role: decoded.role,
    });
  });
};

exports.refreshToken = async (req, res) => {
  const { token } = req.body; // Assume the old token is sent in the request body
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token is not valid" });

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate a new token
    const newToken = jwt.sign(
      { userId: user._id, role: decoded.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ message: "Token refreshed successfully", token: newToken });
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate a password reset token (this is a simplified version)
  const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  // Send the token to the user's email. This part depends on your email service
  // For example: await sendResetEmail(user.email, `Your reset link: http://yourapp.com/reset/${resetToken}`);

  res.json({
    message:
      "If your email is in our system, you will receive a password reset link shortly.",
  });
};

// This function would be part of your registration process
// async function sendVerificationEmail(user) {
//   const verificationToken = jwt.sign(
//     { userId: user._id },
//     process.env.JWT_SECRET,
//     { expiresIn: "24h" }
//   );

//   // Send the verification token via email
//   // await sendEmail(user.email, `Verify your email: http://yourapp.com/verify/${verificationToken}`);
// }

// Verify email endpoint
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err)
      return res
        .status(403)
        .json({ message: "Verification link is invalid or has expired." });

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.emailVerified = true;
    await user.save();

    res.json({ message: "Email verified successfully." });
  });
};

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
        brand: user.brand,
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

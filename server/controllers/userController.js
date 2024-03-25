// controllers/userController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Brand = require("../models/Brand");
const Offer = require("../models/Offers");
const State = require("../models/State");
const UserActivity = require("../models/UserActivity");
const crypto = require("crypto");

const { sendPasswordResetEmail } = require("../services/emailService");

const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is set in your environment

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from authorization header

  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Error verifying token:", err);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Attach decoded token to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next(); // Token is valid, proceed to the next middleware/route handler
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
    const { name, username, email, password, mobile, state } = req.body;

    const stateDocument = await State.findOne({ name: state });
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
      state,
      state: stateDocument._id,
    });

    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Registration error:", error); // Log the complete error
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// exports.register = async (req, res) => {
//   try {
//     const { name, username, email, password, mobile, state } = req.body;
//     console.log("Received state name for registration:", state);

//     // Additional logic like checking if the user exists, hashing the password, etc.

//     const stateDocument = await State.findOne({ name: state });
//     console.log("State found:", stateDocument);

//     if (!stateDocument) {
//       return res.status(400).json({ message: "Invalid state name provided" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const user = new User({
//       name,
//       username,
//       email,
//       password: hashedPassword,
//       mobile,
//       state: stateDocument._id,
//     });

//     await user.save();
//     res.status(201).json({ message: "User created successfully", user });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res
//       .status(500)
//       .json({ message: "Error registering user", error: error.message });
//   }
// };

exports.login = async (req, res) => {
  const { email, password } = req.body;

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

    // Update user login count in UserActivity model
    // Define 'now' here before it's used
    const now = new Date(); // This is the fix

    // Proceed with updating UserActivity for a successful login
    try {
      await UserActivity.findOneAndUpdate(
        { userId: user._id },
        {
          $inc: { userLoginCount: 1 },
          $set: { lastLoginTimestamp: now },
          $push: { sessions: { loginTimestamp: now } }, // Use 'now' here
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error("Error updating user login count and activity:", error);
    }

    // Determine the role based on user document flags
    let role = "user"; // Default role
    if (user.isAdmin) {
      role = "admin";
    } else if (user.isBrand) {
      role = "brand";
    }
    const token = jwt.sign(
      { userId: user._id, role: "user" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const responseObj = {
      message: "Logged in successfully",
      entity: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role, // Hardcoded as "user" since we're only tracking user logins
        brand: user.brand,
      },
      token,
    };

    res.status(200).json(responseObj);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
exports.addToFavorites = async (req, res) => {
  const userId = req.params.userId;
  const offerId = req.params.offerId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if offer is already in favorites
    if (user.favorites.includes(offerId)) {
      return res.status(400).json({ message: "Offer already in favorites" });
    }

    // Add offer to favorites
    user.favorites.push(offerId);
    await user.save();

    res.status(200).json({ message: "Offer added to favorites successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error adding offer to favorites",
      error: error.message,
    });
  }
};

exports.removeFromFavorites = async (req, res) => {
  const userId = req.params.userId;
  const offerId = req.params.offerId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove offer from favorites
    user.favorites = user.favorites.filter(
      (favorite) => favorite.toString() !== offerId
    );
    await user.save();

    res
      .status(200)
      .json({ message: "Offer removed from favorites successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error removing offer from favorites",
      error: error.message,
    });
  }
};

exports.checkFavoriteStatus = async (req, res) => {
  const userId = req.params.userId;
  const offerId = req.params.offerId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isInFavorites = user.favorites.some(
      (favorite) => favorite.toString() === offerId
    );

    res.status(200).json({ isInFavorites });
  } catch (error) {
    res.status(500).json({
      message: "Error checking favorite status",
      error: error.message,
    });
  }
};
exports.getFavoritesForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Populate the 'favorites' field to get offer details
    const userWithFavorites = await User.findById(userId)
      .populate("favorites")
      .exec();

    if (!userWithFavorites) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(userWithFavorites.favorites);
  } catch (error) {
    console.error("Failed to fetch favorites:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch favorites", error: error.message });
  }
};

// find suggest offers user

async function suggestOffersForUser(userId) {
  const user = await User.findById(userId)
    .populate("favorites") // Ensure favorites are populated to access their IDs
    .lean(); // Use .lean() for performance if you only read data

  if (!user) {
    throw new Error("User not found");
  }

  // Extract favorite offer IDs to exclude them from the suggestions
  const favoriteOfferIds = user.favorites.map((favorite) => favorite._id);

  // Initialize the query for finding offers
  let query = { _id: { $nin: favoriteOfferIds } }; // Exclude favorites from the results

  // Attempt to find offers matching the user's state first, excluding favorites
  let offers = await Offer.find({
    ...query,
    state: { $in: [user.state] },
  }).limit(20);

  // If no offers found by state or if state is undefined, fallback to tags and categories, excluding favorites
  if (offers.length === 0 || !user.state) {
    offers = await Offer.find({
      ...query,
      $or: [
        { tags: { $in: user.interests.tags } },
        { category: { $in: user.interests.categories } },
      ],
    }).limit(20);
  }

  return offers;
}

// Controller function to handle the route
exports.getSuggestedOffers = async (req, res) => {
  const userId = req.params.userId; // Assuming the userId is passed as a URL parameter

  try {
    const offers = await suggestOffersForUser(userId);
    res.json(offers);
  } catch (error) {
    console.error("Error fetching suggested offers:", error);
    res.status(500).json({
      message: "Failed to fetch suggested offers",
      error: error.message,
    });
  }
};

// find suggested brands
async function getSuggestedBrandsForUser(userId) {
  const userWithFavorites = await User.findById(userId)
    .populate("favorites")
    .lean(); // Use .lean() for performance improvements

  if (!userWithFavorites) {
    throw new Error("User not found");
  }

  const favoriteTagsAndCategories = userWithFavorites.favorites.reduce(
    (acc, offer) => {
      acc.tags = [...new Set([...acc.tags, ...offer.tags])];
      if (offer.category && !acc.categories.includes(offer.category)) {
        acc.categories.push(offer.category);
      }
      return acc;
    },
    { tags: [], categories: [] }
  );

  const suggestedBrands = await Brand.find({
    $or: [
      { tags: { $in: favoriteTagsAndCategories.tags } },
      { category: { $in: favoriteTagsAndCategories.categories } },
    ],
  })
    .limit(8)
    .lean(); // Limit to 8 brands and use .lean()

  return suggestedBrands;
}

// Controller function to handle fetching suggested brands
exports.getSuggestedBrands = async (req, res) => {
  const userId = req.params.userId;

  try {
    const brands = await getSuggestedBrandsForUser(userId);
    res.json(brands);
  } catch (error) {
    console.error("Error fetching suggested brands:", error);
    res.status(500).json({
      message: "Failed to fetch suggested brands",
      error: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Forgot password endpoint hit with email:", email);
    const user = await User.findOne({ email });

    if (!user) {
      console.log("No user found for email:", email);
      return res.status(200).json({
        message:
          "If your email is in our system, you will receive a password reset link shortly.",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    console.log(`Attempting to send password reset email to: ${email}`);
    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({
      message:
        "If your email is in our system, you will receive a password reset link shortly.",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "An internal error occurred." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
      isBrand: false,
      isAdmin: false,
    });
    console.log("user", user);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Your password has been reset successfully." });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "An internal error occurred." });
  }
};

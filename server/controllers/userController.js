// controllers/userController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Brand = require("../models/Brand");
const Offer = require("../models/Offers");
const State = require("../models/State");
const UserActivity = require("../models/UserActivity");
const crypto = require("crypto");
const client = require("../middleware/redisClient");
const GuestUser = require("./guestUserController");
const { fetchStateByIpAddress } = require("./guestUserController");

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

exports.fetchStateByIpAddress = async (ipAddress) => {
  try {
    const guestUser = await GuestUser.findOne({ ipAddress });
    if (!guestUser) {
      return null; // Return null or an appropriate value if the user isn't found
    }
    return guestUser.state; // Return the state directly
  } catch (error) {
    console.error("Error fetching state by IP address:", error);
    throw new Error("Server error in fetching state"); // Throw an error to be handled by the caller
  }
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
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const ipAddress = req.ip; // Assume you're extracting the IP from the request

  try {
    // Try to find the user by email if credentials are provided
    let user = email ? await User.findOne({ email }) : null;

    // If no user found by email, check for user by IP address
    if (!user) {
      user = await User.findOne({
        lastIPAddress: ipAddress,
        isAdmin: false,
        isBrand: false,
      });
      if (user) {
        // User found by IP, no need for password check
        console.log("User found by IP address:", ipAddress);
      } else if (email) {
        // No user found by email
        console.log("Email not found:", email);
        return res.status(400).json({ message: "Invalid Credentials" });
      } else {
        // No IP match and no credentials provided
        return res
          .status(400)
          .json({ message: "No suitable login method found" });
      }
    } else {
      // User found by email, proceed with password verification
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
    }

    // Update user login count in UserActivity model
    const now = new Date();

    // Proceed with updating UserActivity for a successful login
    try {
      await UserActivity.findOneAndUpdate(
        { userId: user._id },
        {
          $inc: { userLoginCount: 1 },
          $set: { lastLoginTimestamp: now },
          $push: { sessions: { loginTimestamp: now } },
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
    const token = jwt.sign({ userId: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const responseObj = {
      message: "Logged in successfully",
      entity: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role,
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

// Login by IP endpoint
exports.loginByIp = async (req, res) => {
  const ipAddress = req.body.ip; // This should be the real IP address of the client

  try {
    const user = await User.findOne({
      lastIPAddress: ipAddress,
      isAdmin: false,
      isBrand: false,
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "No user found for this IP address" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.isAdmin ? "admin" : user.isBrand ? "brand" : "user",
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "User authenticated successfully by IP",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.isAdmin ? "admin" : user.isBrand ? "brand" : "user",
        brand: user.brand,
      },
      token,
    });
  } catch (error) {
    console.error("Error during IP-based login:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });

//     if (!user) {
//       console.log("Email not found:", email);
//       return res.status(400).json({ message: "Invalid Credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid Credentials" });
//     }

//     // Update user login count in UserActivity model
//     // Define 'now' here before it's used
//     const now = new Date(); // This is the fix

//     // Proceed with updating UserActivity for a successful login
//     try {
//       await UserActivity.findOneAndUpdate(
//         { userId: user._id },
//         {
//           $inc: { userLoginCount: 1 },
//           $set: { lastLoginTimestamp: now },
//           $push: { sessions: { loginTimestamp: now } }, // Use 'now' here
//         },
//         { upsert: true, new: true }
//       );
//     } catch (error) {
//       console.error("Error updating user login count and activity:", error);
//     }

//     // Determine the role based on user document flags
//     let role = "user"; // Default role
//     if (user.isAdmin) {
//       role = "admin";
//     } else if (user.isBrand) {
//       role = "brand";
//     }
//     const token = jwt.sign(
//       { userId: user._id, role: "user" },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );

//     const responseObj = {
//       message: "Logged in successfully",
//       entity: {
//         id: user._id.toString(),
//         name: user.name,
//         email: user.email,
//         role, // Hardcoded as "user" since we're only tracking user logins
//         brand: user.brand,
//       },
//       token,
//     };

//     res.status(200).json(responseObj);
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Error logging in", error: error.message });
//   }
// };

// async function getUserFromCache(ipAddress) {
//   return await client.hgetall(`userData:${ipAddress}`);
// }
// async function createUser(ipAddress, state) {
//   // Generate a random hexadecimal string as a unique part of the username
//   const randomPart = crypto.randomBytes(4).toString("hex");

//   // Create a username combining a prefix with the random part
//   const username = `user_${randomPart}`;

//   // Construct the new user object with the random username and other details
//   const newUser = new User({
//     username, // Random username generated above
//     lastIPAddress: ipAddress, // Ensure the IP address is set here
//     state, // State object ID or state data
//     isAdmin: false, // Default admin status
//     isBrand: false, // Default brand status
//   });

//   // Save the new user to the database
//   await newUser.save();

//   return newUser;
// }

// async function cacheUserData(user) {
//   await client.hset(
//     `userData:${user._id}`,
//     "username",
//     user.username,
//     "state",
//     user.state
//   );
// }
// // Function to get a user from the database by IP address
// async function getUserFromDb(ipAddress) {
//   try {
//     const user = await User.findOne({ lastIPAddress: ipAddress });
//     return user;
//   } catch (error) {
//     console.error("Failed to fetch user from database:", error);
//     throw error; // Consider more graceful error handling here
//   }
// }
// exports.checkAndCreateUser = async (req, res) => {
//   try {
//     const ipAddress = req.body.ip;
//     const stateId = await fetchStateByIpAddress(ipAddress); // This should return an ObjectId
//     console.log("stateId", stateId);

//     if (!stateId) {
//       return res
//         .status(404)
//         .json({ message: "State not found for this IP address" });
//     }

//     let user =
//       (await getUserFromCache(ipAddress)) || (await getUserFromDb(ipAddress));
//     if (user) {
//       return res.status(200).json({ message: "User exists", user });
//     }

//     // Ensure `createUser` uses the ObjectId for the state
//     user = await createUser(ipAddress, stateId);
//     await cacheUserData(user);

//     res.status(201).json({ message: "User created successfully", user });
//   } catch (error) {
//     console.error("Error in user check/creation:", error);
//     res
//       .status(500)
//       .json({ message: "Error processing request", error: error.message });
//   }
// };
// exports.register = async (req, res) => {
//   try {
//     const { name, username, email, password, mobile, state, isAdmin, isBrand } =
//       req.body;

//     // Fetch state document to link with the user
//     const stateDocument = await State.findOne({ name: state });
//     if (!stateDocument) {
//       return res.status(404).json({ message: "State not found" });
//     }

//     // Check if the user already exists
//     if (email && (await User.findOne({ email }))) {
//       return res.status(400).json({
//         message: "This email is already in use, please try another email",
//       });
//     }

//     // Hash password
//     const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

//     // Create new user
//     const user = new User({
//       name,
//       username,
//       email,
//       password: hashedPassword,
//       mobile,
//       state: stateDocument._id,
//       isAdmin: !!isAdmin,
//       isBrand: !!isBrand,
//     });
//     await user.save();

//     // Cache the user data
//     client.hmset(
//       `userData:${user._id}`,
//       "name",
//       name,
//       "username",
//       username,
//       "email",
//       email,
//       "state",
//       stateDocument.name
//     );

//     // Respond with success message
//     res.status(201).json({
//       message: "User created successfully",
//       user: {
//         id: user._id,
//         state: stateDocument.name,
//         role: isAdmin ? "admin" : isBrand ? "brand" : "user",
//       },
//     });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res
//       .status(500)
//       .json({ message: "Error registering user", error: error.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     let user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid Credentials" });
//     }

//     // Password verification
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid Credentials" });
//     }

//     // Determine the user's role
//     const role = user.isAdmin ? "admin" : user.isBrand ? "brand" : "user";

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id, role }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     // Cache the token
//     client.setex(`userToken:${user._id}`, 3600, token);

//     // Respond with user data and token
//     res.status(200).json({
//       message: "Logged in successfully",
//       entity: {
//         id: user._id.toString(),
//         name: user.name,
//         email: user.email,
//         role,
//         brand: user.brand,
//       },
//       token,
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Error logging in", error: error.message });
//   }
// };

// Function to fetch state by IP, adjust accordingly to your data fetching logic

async function getUserFromCache(ipAddress) {
  const userData = await client.hgetall(`userData:${ipAddress}`);
  return userData ? JSON.parse(userData) : null;
}

async function cacheUserData(user) {
  const userData = JSON.stringify({
    username: user.username,
    state: user.state.toString(), // Ensure the state is stringified if it's an ObjectId
  });
  await client.hset(`userData:${user.lastIPAddress}`, userData);
}

async function getUserFromDb(ipAddress) {
  try {
    return await User.findOne({ lastIPAddress: ipAddress });
  } catch (error) {
    console.error("Failed to fetch user from database:", error);
    throw error;
  }
}

async function createUser(ipAddress, state) {
  const randomPart = crypto.randomBytes(4).toString("hex");
  const username = `user_${randomPart}`;
  const newUser = new User({
    username,
    lastIPAddress: ipAddress,
    state,
    isAdmin: false,
    isBrand: false,
  });
  await newUser.save();
  return newUser;
}

exports.checkAndCreateUser = async (req, res) => {
  try {
    const ipAddress = req.body.ip;
    const stateId = await fetchStateByIpAddress(ipAddress);

    if (!stateId) {
      return res
        .status(404)
        .json({ message: "State not found for this IP address" });
    }

    let user = await getUserFromCache(ipAddress);
    if (!user) {
      user = await getUserFromDb(ipAddress);
      if (!user) {
        user = await createUser(ipAddress, stateId);
      }
      await cacheUserData(user); // Cache the user after retrieving from DB or creating a new one
    }

    res.status(user ? 200 : 201).json({
      message: user ? "User exists" : "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Error in user check/creation:", error);
    res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
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

exports.getLoginSummary = async (req, res) => {
  try {
    const loginSummary = await UserActivity.aggregate([
      { $group: { _id: "$date", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json(loginSummary);
  } catch (error) {
    console.error("Error fetching login summary:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch login summary", error: error.message });
  }
};

// find suggest offers user

async function suggestOffersForUser(userId) {
  const user = await User.findById(userId).populate("favorites").lean();

  if (!user) {
    throw new Error("User not found");
  }

  const favoriteOfferIds = user.favorites.map((favorite) => favorite._id);
  const baseQuery = {
    _id: { $nin: favoriteOfferIds },
    status: "approved",
  };

  async function fetchOffersByCriteria(criteria) {
    return await Offer.find({ ...baseQuery, ...criteria }).limit(20);
  }

  // Attempt to fetch by tags
  let offers = await fetchOffersByCriteria({
    tags: { $in: user.interests?.tags || [] },
  });
  if (offers.length >= 2) return offers;

  // Attempt to fetch by state
  offers = await fetchOffersByCriteria({ state: { $in: user.state || [] } });
  if (offers.length >= 2) return offers;

  // Attempt to fetch by category
  offers = await fetchOffersByCriteria({
    category: { $in: user.interests?.categories || [] },
  });
  return offers; // Return whatever is found, even if it's fewer than 2 offers
}

// Controller function to handle the route
exports.getSuggestedOffers = async (req, res) => {
  const userId = req.params.userId;

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
// async function getSuggestedBrandsForUser(userId) {
//   const userWithFavorites = await User.findById(userId)
//     .populate("favorites")
//     .lean(); // Use .lean() for performance improvements

//   if (!userWithFavorites) {
//     throw new Error("User not found");
//   }

//   const favoriteTagsAndCategories = userWithFavorites.favorites.reduce(
//     (acc, offer) => {
//       acc.tags = [...new Set([...acc.tags, ...offer.tags])];
//       if (offer.category && !acc.categories.includes(offer.category)) {
//         acc.categories.push(offer.category);
//       }
//       return acc;
//     },
//     { tags: [], categories: [] }
//   );

//   const suggestedBrands = await Brand.find({
//     $or: [
//       { tags: { $in: favoriteTagsAndCategories.tags } },
//       { category: { $in: favoriteTagsAndCategories.categories } },
//     ],
//   })
//     .limit(8)
//     .lean(); // Limit to 8 brands and use .lean()

//   return suggestedBrands;
// }
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
      // Map each category into its own query clause
      ...favoriteTagsAndCategories.categories.map((category) => ({ category })),
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

// get  all  favirets
exports.getPopularFavorites = async (req, res) => {
  try {
    // Aggregate to find the most favorited offers across all users
    const favorites = await User.aggregate([
      { $unwind: "$favorites" },
      { $group: { _id: "$favorites", count: { $sum: 1 } } },
      { $sort: { count: -1 } }, // Sort by count in descending order
      { $limit: 10 }, // Optional: limit to top 10, you can adjust as needed
    ]);

    // Extract offer IDs
    const offerIds = favorites.map((fav) => fav._id);

    // Find offers by their IDs
    const offers = await Offer.find({ _id: { $in: offerIds } });

    // Sort offers based on the count order
    const sortedOffers = offerIds.map((id) =>
      offers.find((offer) => offer._id.equals(id))
    );

    res.json(sortedOffers);
  } catch (error) {
    res.status(500).send({
      message: "An error occurred while fetching favorite offers.",
      error: error,
    });
  }
};

// Fetch the current state of the user
exports.getState = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("state");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.state);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the state of the user
exports.updateState = async (req, res) => {
  try {
    const { stateId } = req.body;

    // Find the state by ID
    const state = await State.findById(stateId);
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    const { userId } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { state: state._id },
      { new: true }
    ).populate("state");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User's state updated successfully.",
      state: updatedUser.state.name,
    });
  } catch (error) {
    console.error("Error updating user's state:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

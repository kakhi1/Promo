const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  verifyToken,
  verifyEmail,
} = require("../controllers/userController"); // Adjust the path as necessary
const userController = require("../controllers/userController");
const State = require("../models/State");
const User = require("../models/User");

const sessionController = require("../controllers/sessionController");

// Correctly wire up the route to the controller function
router.post("/register", register);
router.post("/login", login);

router.post("/verify-token", verifyToken);

router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);

// Middleware to verify token
// router.use(verifyToken);
// Middleware to verify token, if you have one
// const { verifyToken } = userController;

router.post(
  "/:userId/favorites/:offerId",
  verifyToken,
  userController.addToFavorites
);
router.delete(
  "/:userId/favorites/:offerId",
  verifyToken,
  userController.removeFromFavorites
);
router.get(
  "/:userId/favorites/:offerId",

  userController.checkFavoriteStatus
);
router.get(
  "/:userId/favorites",

  userController.getFavoritesForUser
);
const stateNameMapping = {
  Tbilisi: "თბილისი",

  Kutaisi: "ქუთაისი",
  Batumi: "ბათუმი",
  Rustavi: "რუსთავი",
  Zugdidi: "ზუგდიდი",
  Gori: "გორი",
  Poti: "ფოთი",
  Telavi: "თელავი",
  Akhaltsikhe: "ახალციხე",
  Kobuleti: "ქობულეთი",
  Samtredia: "სამტრედია",
  Kaspi: "კასპი",
  Chiatura: "ჩიატურა",
  Marneuli: "მარნეული",
  Qvareli: "ყვარელი",
};

// PUT request to update user's state based on English state name
router.put("/:userId/state", async (req, res) => {
  console.log("Received English state name:", req.body.englishStateName);

  const { userId } = req.params;
  const { englishStateName } = req.body;

  // Assuming stateNameMapping is defined and maps English state names to Georgian equivalents
  const georgianStateName = stateNameMapping[englishStateName];
  console.log("Mapped to Georgian state name:", georgianStateName);

  if (!georgianStateName) {
    return res.status(400).json({ message: "Invalid state name provided." });
  }

  try {
    console.log("Searching for state with Georgian name:", georgianStateName);
    // Find the state in the database by its Georgian name
    const state = await State.findOne({ name: georgianStateName }).select(
      "_id"
    );

    if (!state) {
      return res.status(404).json({ message: "State not found." });
    }

    // Update the user's state reference and return the updated user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { state: state._id },
      { new: true, select: "-password" }
    ); // Exclude password from the response
    res.json({
      message: "User's state updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user's state:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
// Route to get suggested offers for a user
router.get("/:userId/suggestions", userController.getSuggestedOffers);

// Route to get suggested brands for a user
router.get("/:userId/suggested-brands", userController.getSuggestedBrands);

// Optional: Email verification route
router.get("/verify-email/:token", verifyEmail);

router.post("/session", sessionController.handleSession);

router.get("/favorites/count", async (req, res) => {
  try {
    // Aggregate all users to unwind the favorites and then count the total number
    const result = await User.aggregate([
      { $unwind: "$favorites" }, // Separate the array into individual documents
      { $group: { _id: null, totalFavorites: { $sum: 1 } } }, // Count the total
    ]);

    const totalFavorites = result.length ? result[0].totalFavorites : 0;
    res.status(200).json({ totalFavorites });
  } catch (error) {
    console.error("Error counting all favorites:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Add a route for fetching popular favorites
router.get("/popular-favorites", userController.getPopularFavorites);

router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password/:token", userController.resetPassword);

module.exports = router;

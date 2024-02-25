const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  verifyToken,
  verifyEmail,
} = require("../controllers/userController"); // Adjust the path as necessary
const sessionController = require("../controllers/sessionController");
const locationController = require("../controllers/locationController");

// Correctly wire up the route to the controller function
router.post("/register", register);
router.post("/login", login);

router.post("/verify-token", verifyToken);

router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);

// Optional: Email verification route
router.get("/verify-email/:token", verifyEmail);

router.post("/session", sessionController.handleSession);

// Location route
router.post("/location", locationController.updateLocation);

// Export the router
module.exports = router;

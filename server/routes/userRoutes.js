const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/userController"); // Adjust the path as necessary

// Correctly wire up the route to the controller function
router.post("/register", register);
router.post("/login", login);

// Export the router
module.exports = router;

const express = require("express");
const router = express.Router();
// Import controllers here

router.post("/register" /* Your register controller function */);
router.post("/login" /* Your login controller function */);
// Add more user-related routes

module.exports = router;

const express = require("express");
const { createBrand } = require("../controllers/brandController");
const router = express.Router();

// Route to create a new brand
router.post("/create", createBrand);

module.exports = router;

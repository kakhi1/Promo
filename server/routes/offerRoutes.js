const express = require("express");
const { addOffer } = require("../controllers/offerController");
const router = express.Router();

// Route to add a new offer
router.post("/add", addOffer);

module.exports = router;

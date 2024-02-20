// const express = require("express");
// const router = express.Router();
// const offerController = require("../controllers/offerController");

// // POST request to create a new offer
// router.post("/", offerController.createOffer);

// // GET request to fetch all offers
// router.get("/", offerController.getAllOffers);

// // GET request to fetch a single offer by ID
// router.get("/:id", offerController.getOfferById);

// // PUT request to update an offer by ID
// router.put("/:id", offerController.updateOfferById);

// // DELETE request to delete an offer by ID
// router.delete("/:id", offerController.deleteOfferById);

// module.exports = router;

const express = require("express");
const router = express.Router();
const offerController = require("../controllers/offerController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Configure multer; adjust settings as needed

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  // Assuming you have some way to set req.user (e.g., via authentication middleware)
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).send("Access denied");
  }
}

// POST request to create a new offer, now using multer for image upload
router.post("/", upload.single("image"), offerController.createOffer);

// GET request to fetch all offers
router.get("/", offerController.getAllOffers);

// GET request to fetch a single offer by ID
router.get("/:id", offerController.getOfferById);

// PUT request to update an offer by ID
router.put("/:id", offerController.updateOfferById);

// DELETE request to delete an offer by ID
router.delete("/:id", offerController.deleteOfferById);

// PATCH request to approve an offer by ID (new), protected by isAdmin middleware
router.patch("/approve/:id", isAdmin, offerController.approveOfferById);

// PATCH request for admin to reject an offer, protected by isAdmin middleware
router.patch("/reject/:id", isAdmin, offerController.rejectOfferById);

module.exports = router;

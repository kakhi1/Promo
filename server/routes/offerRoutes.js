const express = require("express");
const router = express.Router();
const offerController = require("../controllers/offerController");

const { arrayUpload } = require("../middleware/uploadConfig");
// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  // Assuming you have some way to set req.user (e.g., via authentication middleware)
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).send("Access denied");
  }
}

// router.post("/offers/increment-views/:id", offerController.incrementOfferViews);
router.post("/increment-views/:id", offerController.incrementOfferViews);

// POST request to create a new offer, now using multer for image upload
// Adjusted route for multiple images
// router.post("/", arrayUpload, offerController.createOffer);

router.post("/", arrayUpload, offerController.createOffer);
// GET request to fetch all offers
router.get("/", offerController.getAllOffers);

router.get("/all", offerController.getAllOffersWithoutFilter);
// GET request to fetch a single offer by ID
// router.get("/:id", offerController.getOfferById);

// PUT request to update an offer by ID
router.put("/:id", arrayUpload, offerController.updateOfferById);

// DELETE request to delete an offer by ID
router.delete("/:id", offerController.deleteOfferById);

// PATCH request to approve an offer by ID (new), protected by isAdmin middleware
router.patch("/approve/:id", isAdmin, offerController.approveOfferById);

// PATCH request for admin to reject an offer, protected by isAdmin middleware
router.patch("/reject/:id", isAdmin, offerController.rejectOfferById);

// Route to get suggested offers based on an offer's ID
router.get("/suggestions/:offerId", offerController.getSuggestedOffers);
// Route to handle adding a share to an offer
router.post("/:offerId/share", offerController.addShare);

// Route to handle fetching the share count for an offer
router.get("/:offerId/shares", offerController.fetchShares);

// Route to increment the visit count for an offer
router.get("/visit/:id", offerController.incrementOfferVisits);

// get all  views, shares, clicks

router.get("/metrics", offerController.countAllMetrics);

router.get("/:id", offerController.getOfferById);

module.exports = router;

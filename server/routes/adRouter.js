const express = require("express");
const router = express.Router();
const adController = require("../controllers/adController"); // Adjust the path as necessary

router.post("/", adController.createAdWithImages);
router.delete("/ads/:id", adController.deleteAd);
router.patch("/ads/:id", adController.modifyAd);
router.get("/ads", adController.fetchAllAds);
router.get("/ads/:id", adController.fetchAdById);
module.exports = router;

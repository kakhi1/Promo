const express = require("express");
const {
  uploadAd,
  changeBrandPassword,
  confirmOffer,
  brandAnalytics,
} = require("../controllers/adminController");
const router = express.Router();

router.post("/uploadAd", uploadAd);
router.post("/changeBrandPassword", changeBrandPassword);
router.post("/confirmOffer", confirmOffer);
router.get("/brandAnalytics", brandAnalytics);

module.exports = router;

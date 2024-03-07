const express = require("express");
const { createBrand, getBrands } = require("../controllers/brandController");
const multer = require("multer");
const { singleUpload } = require("../middleware/uploadConfig");
const brandController = require("../controllers/brandController");
const {
  getOffersByBrandSortedByViews,
} = require("../controllers/brandController");

const router = express.Router();

// router.post("/create", upload.single("image"), createBrand);
router.post("/create", singleUpload, createBrand);

router.get("/", getBrands);
router.get("/offers/:offersId", brandController.getBrandByOfferId);
router.get("/:brandId", brandController.getBrandById);

router.put("/update/:id", singleUpload, brandController.updateBrandById);

// find brandId fetching offers sorted by views

router.get("/:brandId/offers", brandController.findOffersByViews);
// all brand  fetching offers sorted by views

router.get("/offers/all", brandController.findAllOffersByViews);
// Define the route for getting suggested brands
router.get("/:brandId/suggestions", brandController.getSuggestedBrands);
router.delete("/:id", brandController.deleteBrandById);

router.get("/:brandId/metrics", brandController.getBrandMetrics);

router.get(
  "/:brandId/offers-favorites-count",
  brandController.getOffersWithFavoritesCount
);

http: module.exports = router;

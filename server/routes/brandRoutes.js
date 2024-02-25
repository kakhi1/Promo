const express = require("express");
const { createBrand, getBrands } = require("../controllers/brandController");
const multer = require("multer");
const { singleUpload } = require("../middleware/uploadConfig");
const brandController = require("../controllers/brandController");

const router = express.Router();

// router.post("/create", upload.single("image"), createBrand);
router.post("/create", singleUpload, createBrand);

router.get("/", getBrands);
router.get("/offers/:offersId", brandController.getBrandByOfferId);
router.get("/:brandId", brandController.getBrandById);

module.exports = router;

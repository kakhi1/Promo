const express = require("express");
const { createBrand, getBrands } = require("../controllers/brandController");
const multer = require("multer");
const upload = require("../middleware/uploadConfig");
const brandController = require("../controllers/brandController");

const router = express.Router();

router.post("/create", upload.single("image"), createBrand);

router.get("/", getBrands);
router.get("/offers/:offersId", brandController.getBrandByOfferId);
module.exports = router;

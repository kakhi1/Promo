const express = require("express");
const { createBrand, getBrands } = require("../controllers/brandController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/brands/create", upload.single("image"), createBrand);

router.get("/", getBrands);

module.exports = router;

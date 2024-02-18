const express = require("express");
const { createBrand } = require("../controllers/brandController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/brands/create", upload.single("image"), createBrand);

module.exports = router;

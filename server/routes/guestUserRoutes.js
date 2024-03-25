// routes/guestUserRoutes.js
const express = require("express");
const router = express.Router();
const guestUserController = require("../controllers/guestUserController");

router.get("/check-modal/:ip", guestUserController.checkGuestUser);
router.post("/guest-user", guestUserController.addOrUpdateGuestUser);

module.exports = router;

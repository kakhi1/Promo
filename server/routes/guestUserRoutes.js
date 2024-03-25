// routes/guestUserRoutes.js
const express = require("express");
const router = express.Router();
const guestUserController = require("../controllers/guestUserController");

router.get("/check-modal/:ip", guestUserController.checkGuestUser);
router.post("/guest-user", guestUserController.addOrUpdateGuestUser);
// GET request to fetch the state of a GuestUser by ipAddress
router.get("/state/:ipAddress", guestUserController.fetchStateByIpAddress);

module.exports = router;

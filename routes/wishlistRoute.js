const express = require("express");
const router = new express.Router();
const wishlistController = require("../controllers/wishlistController");
const utilities = require("../utilities");

router.get("/", utilities.checkLogin, wishlistController.viewWishlist);
router.post("/add", utilities.checkLogin, wishlistController.addWishlistItem);
router.post("/remove", utilities.checkLogin, wishlistController.removeWishlistItem);

module.exports = router;

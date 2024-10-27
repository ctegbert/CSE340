const express = require("express");
const router = new express.Router();
const favoritesController = require("../controllers/favoritesController");
const utilities = require("../utilities/");

router.get("/", utilities.checkLogin, utilities.handleErrors(favoritesController.buildFavoritesView));
router.post("/add/:invId", utilities.checkLogin, utilities.handleErrors(favoritesController.addFavorite));
router.post("/remove/:invId", utilities.checkLogin, utilities.handleErrors(favoritesController.removeFavorite));

module.exports = router;

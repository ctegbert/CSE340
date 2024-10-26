const express = require("express");
const router = new express.Router();
const favoritesController = require("../controllers/favoritesController");
const utilities = require("../utilities/");

router.get("/", utilities.checkLogin, favoritesController.buildFavoritesView);
router.post("/add/:invId", utilities.checkLogin, favoritesController.addFavorite);
router.post("/remove/:invId", utilities.checkLogin, favoritesController.removeFavorite);

module.exports = router;

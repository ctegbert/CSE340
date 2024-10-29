const favoritesModel = require("../models/favoritesModel");
const utilities = require("../utilities/");

async function addFavorite(req, res, next) {
  try {
      const { invId } = req.params;
      const accountId = res.locals.accountData.account_id;

      // Validate invId and accountId
      if (!invId || isNaN(invId) || !accountId) {
          req.flash("error", "Invalid vehicle ID or user not authenticated.");
          return res.redirect("/inv");
      }

      // Check if the vehicle exists
      const vehicleExists = await favoritesModel.checkVehicleExists(invId);
      if (!vehicleExists) {
          req.flash("error", "The vehicle does not exist.");
          return res.redirect("/inv");
      }

      await favoritesModel.addFavorite(accountId, invId);
      req.flash("notice", "Vehicle added to favorites.");
      res.redirect("/favorites");
  } catch (error) {
      console.error("Error adding favorite:", error);
      next(error);
  }
}

async function removeFavorite(req, res, next) {
  try {
      const { invId } = req.params;
      const accountId = res.locals.accountData.account_id;

      // Validate invId and accountId
      if (!invId || isNaN(invId) || !accountId) {
          req.flash("error", "Invalid vehicle ID or user not authenticated.");
          return res.redirect("/inv");
      }

      await favoritesModel.removeFavorite(accountId, invId);
      req.flash("notice", "Vehicle removed from favorites.");
      res.redirect("/favorites");
  } catch (error) {
      console.error("Error removing favorite:", error);
      next(error);
  }
}

async function buildFavoritesView(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const accountId = req.session.account_id;
    
    // Fetch favorites with inventory details
    const result = await favoritesModel.getFavoritesByAccountId(accountId);

    res.render("account/favorites", {
      title: "My Favorites",
      nav,
      favorites: result.rows, // Ensure result.rows is passed
      errors: null,
      messages: req.flash("notice"),
    });
  } catch (error) {
    console.error("Error loading favorites:", error);
    next(error);
  }
}

module.exports = { addFavorite, removeFavorite, buildFavoritesView };

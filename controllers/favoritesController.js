const favoritesModel = require("../models/favoritesModel");
const utilities = require("../utilities/");

async function addFavorite(req, res, next) { // Added next as a parameter
  try {
    const { invId } = req.params;
    await favoritesModel.addFavorite(res.locals.accountData.account_id, invId);
    req.flash("notice", "Vehicle added to favorites.");
    res.redirect("/favorites");
  } catch (error) {
    console.error("Error adding favorite:", error); // Log the error
    next(error); // Pass the error to the next middleware
  }
}

async function removeFavorite(req, res, next) { // Added next as a parameter
  try {
      const { invId } = req.params; 
      await favoritesModel.removeFavorite(res.locals.accountData.account_id, invId);
      req.flash("notice", "Vehicle removed from favorites.");
      res.redirect("/favorites");
  } catch (error) {
      console.error("Error removing favorite:", error); // Log the error
      next(error); // Pass the error to the next middleware
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

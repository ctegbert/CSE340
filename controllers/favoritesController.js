const favoritesModel = require("../models/favoritesModel");
const utilities = require("../utilities/");

async function addFavorite(req, res) {
  try {
    const { invId } = req.params;
    await favoritesModel.addFavorite(res.locals.accountData.account_id, invId);
    req.flash("notice", "Vehicle added to favorites.");
    res.redirect("/favorites");
  } catch (error) {
    utilities.handleErrors(error, req, res);
  }
}

async function removeFavorite(req, res) {
  try {
    const { invId } = req.params;
    await favoritesModel.removeFavorite(res.locals.accountData.account_id, invId);
    req.flash("notice", "Vehicle removed from favorites.");
    res.redirect("/favorites");
  } catch (error) {
    utilities.handleErrors(error, req, res);
  }
}

async function buildFavoritesView(req, res) {
  try {
    const favorites = await favoritesModel.getFavoritesByAccountId(res.locals.accountData.account_id);
    const nav = await utilities.getNav();
    res.render("account/favorites", {
      title: "My Favorites",
      nav,
      favorites: favorites.rows
    });
  } catch (error) {
    utilities.handleErrors(error, req, res);
  }
}

module.exports = { addFavorite, removeFavorite, buildFavoritesView };

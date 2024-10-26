const wishlistModel = require("../models/wishlistModel");

async function addWishlistItem(req, res, next) {
  const { invId } = req.body;
  const accountId = res.locals.accountData.account_id;
  try {
    await wishlistModel.addToWishlist(accountId, invId);
    req.flash("notice", "Item added to your wishlist!");
    res.redirect("/wishlist");
  } catch (error) {
    next(error);
  }
}

async function removeWishlistItem(req, res, next) {
  const { invId } = req.body;
  const accountId = res.locals.accountData.account_id;
  try {
    await wishlistModel.removeFromWishlist(accountId, invId);
    req.flash("notice", "Item removed from your wishlist.");
    res.redirect("/wishlist");
  } catch (error) {
    next(error);
  }
}

async function viewWishlist(req, res, next) {
  const accountId = res.locals.accountData.account_id;
  try {
    const wishlistItems = await wishlistModel.getWishlistByAccountId(accountId);
    res.render("wishlist/view", {
      title: "My Wishlist",
      items: wishlistItems.rows,
      nav: res.locals.nav,
      messages: req.flash("notice"),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { addWishlistItem, removeWishlistItem, viewWishlist };

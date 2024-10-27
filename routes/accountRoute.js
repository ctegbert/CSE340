// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Route for the "My Account" page
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route for the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route for the account management view with JWT token and login check middleware
router.get(
  "/",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Route for the logout process
router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
});

// Route to render the account update form
router.get(
  "/update/:accountId",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
);

router.post(
  "/update/:accountId",
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccount)
);

router.post(
  "/update-password/:accountId",
  utilities.checkLogin,
  utilities.handleErrors(accountController.updatePassword)
);

// Optional: Route for "My Favorites" if `buildFavoritesView` is implemented
router.get(
  "/favorites",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildFavoritesView)
);

// Export the router for use elsewhere in the project
module.exports = router;

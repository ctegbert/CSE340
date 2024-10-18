// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Route for the "My Account" page
router.get("/login", accountController.buildLogin);

// Route for the registration view
router.get("/register", accountController.buildRegister);

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    accountController.registerAccount
  );

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),  // Make sure this validation exists
  regValidate.checkLoginData,  // And this function is defined
  utilities.handleErrors(accountController.accountLogin) // Point to accountLogin correctly
);

// Route for the account management view with JWT token and login check middleware
router.get("/", 
  utilities.checkJWTToken, 
  utilities.checkLogin,  // Add this check to ensure the user is logged in
  utilities.handleErrors(accountController.buildAccountManagement)
);

// In your accountRoute.js or similar file
router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
});



// Export the router for use elsewhere in the project
module.exports = router;

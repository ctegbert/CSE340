const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Build the login view
async function buildLogin(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      messages: req.flash("notice"),
    });
  } catch (error) {
    next(error);
  }
}

// Build the registration view
async function buildRegister(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
      messages: req.flash("notice"),
    });
  } catch (error) {
    next(error);
  }
}

// Register a new account
async function registerAccount(req, res, next) {
  // Implement registration logic here, ensuring passwords are hashed before saving to the database
}

// Process login request
async function accountLogin(req, res, next) {
  try {
    const { account_email, account_password } = req.body;

    // Retrieve account data by email
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
      req.flash("notice", "Invalid email or password.");
      return res.redirect("/account/login");
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(account_password, accountData.account_password);
    if (!isPasswordMatch) {
      req.flash("notice", "Invalid email or password.");
      return res.redirect("/account/login");
    }

    // Create JWT token
    const token = jwt.sign(
      { account_id: accountData.account_id, email: accountData.account_email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    // Store JWT in cookie and account_id in session
    res.cookie("jwt", token, { httpOnly: true });
    req.session.account_id = accountData.account_id;
    res.cookie("account_id", accountData.account_id, { httpOnly: true });

    req.flash("notice", "You have successfully logged in!");
    return res.redirect("/account/");
  } catch (error) {
    console.error("Error in accountLogin:", error);
    next(error);
  }
}

// Build the account management view
async function buildAccountManagement(req, res, next) {
  try {
    // Retrieve the account ID from session or cookie
    const accountId = req.session.account_id || req.cookies.account_id;

    if (!accountId) {
      req.flash("notice", "Account not found.");
      return res.redirect("/account/login");
    }

    // Fetch account data
    const accountData = await accountModel.getAccountById(accountId);

    // Check if account data was retrieved successfully
    if (!accountData) {
      req.flash("notice", "Account not found.");
      return res.redirect("/account/login");
    }

    // Render the management view, passing all necessary variables
    res.render("account/management", {
      title: "Account Management",
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id: accountData.account_id,  // Ensure account_id is passed
      account_type: accountData.account_type, // Ensure account_type is passed
      nav: res.locals.nav,
    });
  } catch (error) {
    console.error("Error building account management view:", error);
    next(error);
  }
}

// Render the account update form
async function buildUpdateAccount(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const accountId = req.params.accountId; // Get accountId from route parameter

    // Fetch account data using accountId
    const accountData = await accountModel.getAccountById(accountId);
    if (!accountData) {
      req.flash("notice", "Account not found.");
      return res.redirect("/account");
    }

    // Render the update view, ensuring accountData is passed as "account"
    res.render("account/update", { 
      title: "Update Account Information",
      nav,
      account: accountData, // Pass account data as "account"
      errors: null,
      messages: req.flash("notice"),
    });
  } catch (error) {
    next(error);
  }
}

// Update account information
async function updateAccount(req, res, next) {
  // Implement update logic here
}

// Update account password
async function updatePassword(req, res, next) {
  // Implement password update logic here
}

// Placeholder for buildFavoritesView (for the favorites feature)
async function buildFavoritesView(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("account/favorites", {
      title: "My Favorites",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildUpdateAccount,
  updateAccount,
  updatePassword,
  buildFavoritesView,
};

// Needed Resources
const utilities = require("../utilities/index");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
      account_firstname: '',
      account_lastname: '',
      account_email: '',
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(account_password, 10);

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword // Save hashed password
    );

    if (regResult.rowCount) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}! Please log in.`
      );
      res.redirect("/account/login");
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("account/register", {
        title: "Register",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
      });
    }
  } catch (error) {
    next(error);
  }
}


/* ****************************************
*  Process login request
* *************************************** */
async function accountLogin(req, res, next) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  console.log("Login attempt:", account_email);

  const accountData = await accountModel.getAccountByEmail(account_email);
  
  if (!accountData) {
    console.log("No account found for:", account_email);
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }
  
  try {
    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password);
    console.log("Password match:", passwordMatch);
    
    if (passwordMatch) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
      console.log("Access Token:", accessToken);
      
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookie in production
        maxAge: 3600 * 1000, // 1 hour
      });
      
      console.log("Redirecting to /account...");
      return res.redirect("/account");
    } else {
      console.log("Passwords do not match");
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    console.error("Error during login process:", error);
    next(error);
  }
}


/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccountManagement(req, res, next) {
  try {
    let nav = await utilities.getNav();
    // Access account data from res.locals
    const accountData = res.locals.accountData;

    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      messages: req.flash('notice'),
      account_firstname: accountData.account_firstname,
      account_type: accountData.account_type,
      account_id: accountData.account_id // Pass the account ID for the update link
    });
  } catch (error) {
    next(error);
  }
}


/* ****************************************
*  Deliver update account view
* *************************************** */
async function buildUpdateAccount(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const accountId = req.params.accountId;
    const accountData = await accountModel.getAccountById(accountId);

    res.render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null,
      account: accountData // Pass the account data for form population
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
*  Update account information
* *************************************** */
async function updateAccount(req, res, next) {
  try {
    const { account_firstname, account_lastname, account_email } = req.body;
    const accountId = req.params.accountId;
    
    // Call the model to update the account information
    const updateResult = await accountModel.updateAccountById(accountId, account_firstname, account_lastname, account_email);

    if (updateResult.rowCount) {
      req.flash("notice", "Account successfully updated.");
      return res.redirect("/account");
    } else {
      req.flash("notice", "Account update failed. Please try again.");
      return res.status(400).redirect(`/account/update/${accountId}`);
    }
  } catch (error) {
    next(error);
  }
}

/* ****************************************
*  Update account password
* *************************************** */
async function updatePassword(req, res, next) {
  try {
    const { new_password, account_id } = req.body;

    // Hash the new password before storing it
    const hashedPassword = await bcrypt.hash(new_password, 10);

    const updateResult = await accountModel.updatePasswordById(account_id, hashedPassword);

    if (updateResult.rowCount) {
      req.flash("notice", "Password successfully updated.");
      return res.redirect("/account");
    } else {
      req.flash("notice", "Password update failed. Please try again.");
      return res.status(400).redirect(`/account/update/${account_id}`);
    }
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
};

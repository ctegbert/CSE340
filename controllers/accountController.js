// Needed Resources
const utilities = require("../utilities/index");

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
    });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
}

module.exports = { buildLogin };

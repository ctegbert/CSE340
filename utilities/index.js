const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken"); // Ensure jwt is defined for token management
require("dotenv").config();

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  try {
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
      list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
    });
    list += "</ul>";
    return list;
  } catch (error) {
    console.error("Error fetching navigation data:", error);
    return "<ul><li>Error loading navigation</li></ul>"; // Fallback in case of error
  }
};

/* **************************************
 * Middleware to check token validity
 ************************************ */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = true;
        next();
      }
    );
  } else {
    next();
  }
};

/* **************************************
 * Check Login Middleware
 ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* **************************************
 * Error handling wrapper for async functions
 ************************************ */
Util.handleErrors = function (fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/* **************************************
 * Build Classification Grid
 ************************************ */
Util.buildClassificationGrid = function (data) {
  let grid = "<ul id='inv-display'>";
  data.forEach((vehicle) => {
    grid += "<li>";
    grid += `<a href="/inv/detail/${vehicle.inv_id}"><img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}"></a>`;
    grid += "<div class='namePrice'>";
    grid += `<h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>`;
    grid += `<span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>`;
    grid += "</div>";
    grid += "</li>";
  });
  grid += "</ul>";
  return grid;
};

module.exports = Util;

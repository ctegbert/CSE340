/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const session = require("express-session")
const pool = require('./database/')
const accountRoute = require("./routes/accountRoute");
const favoritesRoute = require("./routes/favoritesRoute");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const utilities = require("./utilities/index");
const cookieParser = require("cookie-parser")


/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
}));

// Flash Middleware
app.use(flash());

// Middleware to make flash messages available in views
app.use(function(req, res, next) {
  res.locals.messages = req.flash();
  next();
});

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to make the navigation available in all views
app.use(async function(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.locals.nav = nav;
    next();
  } catch (error) {
    next(error);
  }
});

app.use(cookieParser())

// Middleware to check JWT Token
app.use(utilities.checkJWTToken);

// Middleware to set local variables for views
app.use((req, res, next) => {
  res.locals.loggedin = req.cookies.jwt ? true : false;
  res.locals.accountData = req.cookies.jwt ? res.locals.accountData : null;
  next();
});

/* ***********************
 * View Engines and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/
app.use(static);

// Index route
app.get("/", baseController.buildHome);

// Account route
app.use("/account", accountRoute);

// Inventory routes
app.use("/inv", inventoryRoute);

// Favorites route
app.use("/favorites", favoritesRoute);

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

// Catch-all 404 handler for undefined routes
app.use((req, res, next) => {
  const err = new Error("Sorry, the page you are looking for does not exist.");
  err.status = 404;
  next(err);
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.status || 500;
  let title = statusCode === 404 ? "Page Not Found" : "Server Error";
  let message = statusCode === 404 
    ? "Sorry, the page you are looking for does not exist." 
    : "This is an intentional HTTP 500 Internal Server Error.";
  let errorType = statusCode === 404 ? "404" : "500";

  res.status(statusCode).render("error", {
    title,
    message,
    errorType,
    error: process.env.NODE_ENV === "development" ? err.message : "",
    nav: res.locals.nav || "", 
  });
});

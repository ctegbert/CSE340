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
/* ***********************
 * View Engines and Templetes
 *************************/

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", baseController.buildHome)

// Inventory routes
app.use("/inv", inventoryRoute)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

// Catch-all 404 handler for undefined routes
app.use((req, res, next) => {
  const err = new Error("Sorry, the page you are looking for does not exist.");
  err.status = 404;
  next(err); // Pass the error to the error-handling middleware
});


// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging

  // Set status code based on the error or default to 500
  const statusCode = err.status || 500;

  // Determine the title, message, and error type based on the status code
  let title = statusCode === 404 ? "Page Not Found" : "Server Error";
  let message = statusCode === 404 
    ? "Sorry, the page you are looking for does not exist." 
    : "This is an intentional HTTP 500 Internal Server Error.";
  let errorType = statusCode === 404 ? "404" : "500";

  // Render the error page and pass the error type
  res.status(statusCode).render("error", {
    title,
    message,
    error: process.env.NODE_ENV === "development" ? err.message : "",
    nav: "", // Provide an empty string for the 'nav' variable if not needed
    errorType // Pass the error type to the template
  });
});



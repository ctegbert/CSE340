// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const accountController = require("../controllers/accountController");

// Route for the login page
router.get("/login", accountController.buildLogin);

// Route for the registration page
router.get("/register", accountController.buildRegister);

// Route for processing the registration form
router.post('/register', accountController.registerAccount);

// Error handler for this route
router.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    res.status(statusCode).render("error", {
        title: statusCode === 404 ? "Page Not Found" : "Server Error",
        message: statusCode === 404
            ? "Sorry, the page you are looking for does not exist."
            : "An error occurred while processing your request.",
        error: process.env.NODE_ENV === "development" ? err.message : "",
    });
});

// Export the router for use elsewhere in the project
module.exports = router;

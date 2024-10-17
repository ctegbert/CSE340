// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build vehicle detail view by vehicle id
router.get("/detail/:invId", invController.buildByInventoryId);

// Intentional Error Route
router.get("/trigger-error", (req, res, next) => {
    // Intentionally throwing an error to test error handling
    const error = new Error("This is an intentional HTTP 500 Internal Server Error.");
    error.status = 500;
    next(error); // Pass the error to the next middleware (our error-handling middleware)
  });
  
  module.exports = router;
  


module.exports = router;
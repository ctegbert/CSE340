// Needed Resources 
const express = require("express");
const router = new express.Router();
const invCont = require("../controllers/invController");
const classificationValidation = require('../utilities/classification-validation');

// Route for add classification view
router.get("/add-classification", invCont.buildAddClassification);

// Route to process the classification data
router.post(
  "/add-classification",
  classificationValidation.classificationRules(),
  classificationValidation.checkClassificationData,
  invCont.processAddClassification
);

// Route to build inventory by classification view
router.get("/type/:classificationId", invCont.buildByClassificationId);

// Route to build vehicle detail view by vehicle id
router.get("/detail/:invId", invCont.buildByInventoryId); // Changed to use invCont

// Intentional Error Route
router.get("/trigger-error", (req, res, next) => {
    // Intentionally throwing an error to test error handling
    const error = new Error("This is an intentional HTTP 500 Internal Server Error.");
    error.status = 500;
    next(error); // Pass the error to the next middleware (our error-handling middleware)
});

// Route for management view
router.get("/", invCont.buildManagement);

module.exports = router;

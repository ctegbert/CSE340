// Needed Resources 
const express = require("express");
const router = new express.Router();
const invCont = require("../controllers/invController");
const classificationValidation = require('../utilities/classification-validation');
const utilities = require("../utilities/index");

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
router.get("/detail/:invId", invCont.buildByInventoryId);

// Intentional Error Route
router.get("/trigger-error", (req, res, next) => {
    // Intentionally throwing an error to test error handling
    const error = new Error("This is an intentional HTTP 500 Internal Server Error.");
    error.status = 500;
    next(error);
});

// Route for the inventory management view
router.get("/", utilities.handleErrors(invCont.buildManagement));

// Route to get inventory by classification as JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invCont.getInventoryJSON));

module.exports = router;

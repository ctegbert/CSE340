// Needed Resources 
const express = require("express");
const router = new express.Router();
const invCont = require("../controllers/invController");
const classificationValidation = require('../utilities/classification-validation');
const utilities = require("../utilities/index");
const inventoryValidation = require('../utilities/inventory-validation');

// Middleware to restrict access based on account type
const restrictAccess = (req, res, next) => {
  if (res.locals.loggedin && (res.locals.accountData.account_type === 'Employee' || res.locals.accountData.account_type === 'Admin')) {
    return next(); // Allow access
  }
  req.flash("notice", "You do not have permission to access this page.");
  res.redirect("/account/login"); // Redirect to login if access is denied
};

// Route to build the add inventory view
router.get("/add-inventory", restrictAccess, utilities.handleErrors(invCont.buildAddInventory));

// Route for add classification view
router.get("/add-classification", restrictAccess, invCont.buildAddClassification);

// Route to process the classification data
router.post(
  "/add-classification",
  restrictAccess,
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
    const error = new Error("This is an intentional HTTP 500 Internal Server Error.");
    error.status = 500;
    next(error);
});

// Route for the inventory management view
router.get("/", restrictAccess, utilities.handleErrors(invCont.buildManagement));

// Route to get inventory by classification as JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invCont.getInventoryJSON));

// Route to build the edit inventory view
router.get("/edit/:inv_id", restrictAccess, utilities.handleErrors(invCont.editInventoryView));

// Route to handle update inventory data
router.post(
  "/update", 
  restrictAccess,
  inventoryValidation.newInventoryRules(), 
  inventoryValidation.checkUpdateData, 
  utilities.handleErrors(invCont.updateInventory)
);

// Route to add a new inventory item
router.post(
  "/add-inventory",
  restrictAccess,
  inventoryValidation.newInventoryRules(),
  inventoryValidation.checkInventoryData,
  utilities.handleErrors(invCont.addNewInventory)
);

// Route to build the delete confirmation view
router.get("/delete/:inv_id", restrictAccess, utilities.handleErrors(invCont.deleteInventoryView));

// Route to handle delete inventory data
router.post("/delete", restrictAccess, utilities.handleErrors(invCont.deleteInventory));

module.exports = router;

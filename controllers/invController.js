const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    if (data.length > 0) {
      const grid = await utilities.buildClassificationGrid(data);
      const nav = await utilities.getNav();
      const className = data[0].classification_name;
      res.render("./inventory/classification", {
        title: `${className} vehicles`,
        nav,
        grid,
      });
    } else {
      req.flash("notice", "No vehicles found for this classification.");
      res.redirect("/inv");
    }
  } catch (err) {
    next(err); // Pass the error to the error-handling middleware
  }
};

/* ***************************
 *  Build inventory by Inv ID
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const invId = req.params.invId;
    const data = await invModel.getInventoryById(invId);
    const nav = await utilities.getNav();

    if (data.length > 0) {
      const vehicle = data[0];
      res.render("./inventory/detail", {
        title: `${vehicle.inv_make} ${vehicle.inv_model}`,
        nav,
        vehicle,
      });
    } else {
      req.flash("notice", "Vehicle not found.");
      res.redirect("/inv");
    }
  } catch (err) {
    next(err); // Pass the error to the error-handling middleware
  }
};

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(); // Get the classification list
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect, // Pass the list to the view
      errors: null,
      messages: req.flash('notice')
    });
  } catch (error) {
    next(error);
  }
};


/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      messages: req.flash("notice"),
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Process add classification
 * ************************** */
invCont.processAddClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    const result = await invModel.addClassification(classification_name);
    if (result) {
      req.flash("notice", "Classification added successfully!");
      res.redirect("/inv");
    } else {
      req.flash("notice", "Error adding classification.");
      res.redirect("/inv/add-classification");
    }
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    if (invData.length > 0) {
      return res.json(invData);
    } else {
      res.status(404).json({ message: "No data returned" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;

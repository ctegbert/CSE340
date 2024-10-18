const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
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

    if (data) {
      const vehicle = data[0];
      res.render("./inventory/detail", {
        title: `${vehicle.inv_make} ${vehicle.inv_model}`,
        nav,
        vehicle,
      });
    } else {
      res.status(404).send("Vehicle not found");
    }
  } catch (err) {
    next(err); // Pass the error to the error-handling middleware
  }
};

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function(req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    messages: req.flash('notice')
  });
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function(req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    messages: req.flash('notice')
  });
}

/* ***************************
 *  Process add classification
 * ************************** */
invCont.processAddClassification = async function(req, res, next) {
  const { classification_name } = req.body;
  let result = await invModel.addClassification(classification_name);
  if (result) {
    req.flash("notice", "Classification added successfully!");
    res.redirect("/inv");
  } else {
    req.flash("notice", "Error adding classification.");
    res.redirect("/inv/add-classification");
  }
};

module.exports = invCont;

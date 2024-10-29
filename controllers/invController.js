const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const favoritesModel = require("../models/favoritesModel");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const nav = await utilities.getNav();

    if (data.length > 0) {
      const grid = await utilities.buildClassificationGrid(data);
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
    
    // Fetch user's favorites
    const accountId = req.session.account_id;
    const favoritesResult = await favoritesModel.getFavoritesByAccountId(accountId);
    
    // Add favorites to the render data
    if (data.length > 0) {
      const vehicle = data[0];
      res.render("./inventory/detail", {
        title: `${vehicle.inv_make} ${vehicle.inv_model}`,
        nav,
        vehicle,
        favorites: favoritesResult.rows, // Ensure this line passes favorites to the view
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
 *  Add New Inventory Item
 * ************************** */
invCont.addNewInventory = async function (req, res, next) {
  try {
    // Get the navigation
    let nav = await utilities.getNav();
    
    // Collect the form data
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;

    // Model function to add the vehicle to the database
    const addResult = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    );

    // Check the result and flash a message
    if (addResult) {
      req.flash("notice", "The new vehicle was successfully added.");
      res.redirect("/inv/");
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id);
      req.flash("notice", "Error: Adding the vehicle failed.");
      res.status(501).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationSelect,
        errors: null,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      });
    }
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

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryById(inv_id);

    if (itemData.length === 0) {
      req.flash("notice", "No inventory item found");
      return res.redirect("/inv");
    }

    const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id);
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;

    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_description: itemData[0].inv_description,
      inv_image: itemData[0].inv_image,
      inv_thumbnail: itemData[0].inv_thumbnail,
      inv_price: itemData[0].inv_price,
      inv_miles: itemData[0].inv_miles,
      inv_color: itemData[0].inv_color,
      classification_id: itemData[0].classification_id
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;

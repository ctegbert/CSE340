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


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  // Make sure classification_id is a single integer
  const parsedClassificationId = parseInt(classification_id, 10);

  if (isNaN(parsedClassificationId)) {
    req.flash("notice", "Invalid classification selected.");
    return res.redirect("/inv/edit/" + inv_id);
  }

  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    parsedClassificationId // Pass the parsed integer
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(parsedClassificationId);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id: parsedClassificationId,
    });
  }
};


/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
  res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_price: itemData[0].inv_price
  });
};

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id);
  const deleteResult = await invModel.deleteInventoryItem(inv_id);
  
  if (deleteResult.rowCount) {
      req.flash("notice", "The vehicle was successfully deleted.");
      res.redirect("/inv/");
  } else {
      req.flash("notice", "Error: Deletion failed.");
      res.redirect(`/inv/delete/${inv_id}`);
  }
};


/* ***************************
 *  Build Add Inventory View
 * ************************** */
/* ***************************
 *  Build Add Inventory View
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    console.log("Add Inventory Route Accessed"); // Debugging line
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: null,
      messages: req.flash('notice')
    });
  } catch (error) {
    console.error("Error building add inventory view: ", error);
    next(error);
  }
};




module.exports = invCont;

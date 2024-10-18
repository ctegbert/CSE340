const { body, validationResult } = require('express-validator');
const utilities = require('../utilities/index');

/* ***************************
 * New Inventory Validation Rules
 * ************************** */
const newInventoryRules = () => {
  return [
    body('inv_make')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please provide a valid make.'),
    body('inv_model')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please provide a valid model.'),
    body('inv_year')
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage('Please provide a valid year.'),
    body('inv_description')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please provide a valid description.'),
    body('inv_image')
      .trim()
      .matches(/^(\/|https?:\/\/)/) // Allow relative paths or full URLs
      .withMessage('Please provide a valid image URL.'),
    body('inv_thumbnail')
      .trim()
      .matches(/^(\/|https?:\/\/)/) // Allow relative paths or full URLs
      .withMessage('Please provide a valid thumbnail URL.') 
      .withMessage('Please provide a valid thumbnail URL.'),
    body('inv_price')
      .isFloat({ min: 0 })
      .withMessage('Please provide a valid price.'),
    body('inv_miles')
      .isInt({ min: 0 })
      .withMessage('Please provide valid mileage.'),
    body('inv_color')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please provide a valid color.'),
      body('classification_id')
      .isInt({ min: 1 })
      .withMessage('Please select a valid classification.')
      .toInt()
  ];
};

/* ***************************
 * Check Inventory Data
 * ************************** */
const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(req.body.classification_id);
    return res.status(400).render('inventory/add-inventory', {
      title: 'Add New Vehicle',
      nav,
      classificationSelect,
      errors,
      ...req.body,
    });
  }
  next();
};

/* ***************************
 * Check Update Data
 * ************************** */
const checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(req.body.classification_id);
    const itemName = `${req.body.inv_make} ${req.body.inv_model}`;
    return res.status(400).render('inventory/edit-inventory', {
      title: 'Edit ' + itemName,
      nav,
      classificationSelect,
      errors,
      ...req.body,
    });
  }
  next();
};

module.exports = {
  newInventoryRules,
  checkInventoryData,
  checkUpdateData
};

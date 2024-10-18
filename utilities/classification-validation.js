const { body, validationResult } = require("express-validator");
const validate = {};

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification name is required.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name must not contain special characters or spaces.")
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors,
      messages: req.flash('notice'),
      classification_name
    });
    return;
  }
  next();
};

module.exports = validate;

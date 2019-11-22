const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateCreateCardInput(data) {
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.name = !isEmpty(data.name) ? data.name : "";

    if (Validator.isEmpty(data.name)) {
        errors.name = "The name of the card is required";
    }

    if (!Validator.isLength(data.name, { min: 1, max: 100 })) {
        errors.name = "First Name must be between 1 and 100 characters";
      }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateUpdateUser(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.userName = !isEmpty(data.userName) ? data.userName : "";
  data.email = !isEmpty(data.email) ? data.email : "";

  // First Name checks
  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "First Name field is required";
  }

  if (!Validator.isLength(data.firstName, { min: 2, max: 50 })) {
    errors.firstName = "First Name must be between 2 and 50 characters";
  }

  // Last Name checks
  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "Last Name field is required";
  }

  if (!Validator.isLength(data.lastName, { min: 2, max: 50 })) {
    errors.lastName = "Last Name must be between 2 and 50 characters";
  }
  
  // User Name checks
  if (Validator.isEmpty(data.userName)) {
    errors.userName = "User Name field is required";
  }

  if (!Validator.isLength(data.userName, { min: 3, max: 30 })) {
    errors.userName = "User Name must be between 3 and 30 characters";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
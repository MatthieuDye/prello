const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateUpdateCard(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.newName = !isEmpty(data.newName) ? data.newName : "";
  data.newDescription = !isEmpty(data.newDescription) ? data.newDescription : "";
  data.newDueDate = !isEmpty(data.newDueDate) ? data.newDueDate : "";
  data.newDueDateIsDone = !isEmpty(data.newDueDateIsDone) ? data.newDueDateIsDone : "";
  data.newIsArchived = !isEmpty(data.newIsArchived) ? data.newIsArchived : "";

  // Card Name checks
  if (Validator.isEmpty(data.newName)) {
    errors.name = "Card Name field is required";
  }

  if (!Validator.isLength(data.newName, { min: 1, max: 100 })) {
    errors.name = "Card Name must be between 1 and 100 characters";
  }

  // Description checks
  /*if (Validator.isEmpty(data.newDescription)) {
    errors.description = "Card description field is required";
  }

  if (!Validator.isLength(data.newDescription, { min: 0, max: 1000 })) {
    errors.description = "Card description must be between 0 and 1000 characters";
  }
  
  // Card due date checks
  if (Validator.isEmpty(data.newDueDate)) {
    errors.dueDate = "Card due date field is required";
  }*/
  
  // Card due date status checks
  if (data.newDueDateIsDone != false && data.newDueDateIsDone != true) {
    errors.dueDateIsDone = "Card due date status field is required as a boolean";
  }

  // Card archived status date checks
  if (data.newIsArchived != false && data.newIsArchived != true) {
    errors.isArchived = "Card archived status field is required as a boolean";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
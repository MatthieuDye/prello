const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateCreateTeamInput(data) {
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.name = !isEmpty(data.name) ? data.name : "";
    data.urlAvatar = !isEmpty(data.urlAvatar) ? data.urlAvatar : "";
    data.description = !isEmpty(data.description) ? data.description : "";

    // Email checks
    if (Validator.isEmpty(data.name)) {
        errors.name = "The name of the team is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

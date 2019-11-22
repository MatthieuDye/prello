const isEmpty = require("is-empty");

module.exports = function validateIdParam(id) {
    let errors = {};

    if (id === "undefined" || !id.match(/^[0-9a-fA-F]{24}$/)) {
        errors.name = `This id ${id} is incorrect`;
    }

    return {
        errors,
        idIsValid: isEmpty(errors)
    };
};

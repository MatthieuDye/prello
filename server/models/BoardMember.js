let mongoose = require('mongoose');
let idValidator = require('mongoose-id-validator');

let Schema = mongoose.Schema;

let memberSchema = new Schema({
        idUser: {
            required  : true,
            type      : Schema.Types.ObjectId,
            ref : 'users'
        },
        admin: {
            type: Boolean,
            required : true,
            default : false
        },
        teamMember: {
            type: Boolean,
            required : true,
            default : false
        },
    },
    {
        toJSON: { virtuals: true },
        versionKey: false
    });

memberSchema.plugin(idValidator);

/**
 * Check if the user is admin
 * @returns {boolean} true if admin or false else
 */
memberSchema.methods.isAdmin = function(){
    return this.isAdmin;
};

module.exports = memberSchema;
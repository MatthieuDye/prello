let mongoose = require('mongoose');
let idValidator = require('mongoose-id-validator');

let Schema = mongoose.Schema;

let memberSchema = new Schema({
        idUser: {
            required  : true,
            type      : Schema.Types.ObjectId,
            ref : 'User'
        },
        subscriberType: {
            type: String,
            enum: ['normal', 'admin'],
            required : true,
            default : ['normal']
        }
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
    return this.subscriberType === 'admin';
};

/**
 * Check if the user is normal user
 * @returns {boolean} true if normal or false else
 */
memberSchema.methods.isNormal = function(){
    return this.subscriberType === 'normal';
};

module.exports = memberSchema;
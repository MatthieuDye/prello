let mongoose = require('mongoose');
let idValidator = require('mongoose-id-validator');

let Schema = mongoose.Schema;

let subscriberSchema = new Schema({
        idUser: {
            required  : true,
            type      : Schema.Types.ObjectId,
            ref : 'User'
        },
        subscriberType: {
            type: String,
            enum: ['normal', 'owner', 'observer'],
            required : true,
            default : ['observer']
        }
    },
    {
        toJSON: { virtuals: true },
        versionKey: false
    });

subscriberSchema.plugin(idValidator);

/**
 * Check if the user is admin
 * @returns {boolean} true if admin or false else
 */
subscriberSchema.methods.isAdmin = function(){
    return this.subscriberType === 'admin';
};

/**
 * Check if the user is normal user
 * @returns {boolean} true if normal or false else
 */
subscriberSchema.methods.isNormal = function(){
    return this.subscriberType === 'normal';
};

/**
 * Check if the user is observer user
 * @returns {boolean} true if observer or false else
 */
subscriberSchema.methods.isObserver = function(){
    return this.subscriberType === 'observer';
};

module.exports = subscriberSchema;
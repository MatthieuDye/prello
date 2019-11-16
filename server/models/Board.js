const mongoose = require('mongoose');
const isNullOrUndefined = require("mongoose");
const idValidator = require('mongoose-id-validator');


const Schema = mongoose.Schema;

const boardSchema = new Schema({
        name: {
            required  : true,
            minlength : 3,
            maxlength : 100,
            type      : String
        },
        description: {
            required  : false,
            type      : String,
            maxlength : 1000,
        },
        admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        guestMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        team : {
            required  : false,
            type      : Schema.Types.ObjectId,
            ref : 'Team'
        },
        closed : {
            required : true,
            type : Boolean,
            default : false
        },

        labelNames: {
            green : {
                type : String,
                default : ""
            },
            yellow : {
                type : String,
                default : ""
            },
            orange : {
                type : String,
                default : ""
            },
            red : {
                type : String,
                default : ""
            },
            purple : {
                type : String,
                default : ""
            },
            blue : {
                type : String,
                default : ""
            },
            pink : {
                type : String,
                default : ""
            }
        }
    },
    {
        toJSON: { virtuals: true },
        versionKey: false
    });

boardSchema.plugin(idValidator);

boardSchema.virtual('labels', {
    ref: 'Label', // The model to use
    localField: '_id', // Find people where `localField`
    foreignField: 'idBoard' // is equal to `foreignField`
});

boardSchema.virtual('lists', {
    ref: 'List', // The model to use
    localField: '_id', // Find people where `localField`
    foreignField: 'idList' // is equal to `foreignField`
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
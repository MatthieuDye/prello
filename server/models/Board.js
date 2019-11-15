const mongoose = require('mongoose');
const BoardMember = require('./BoardMember');
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
        isFavorite: {
            required: false,
            type: Boolean,
            default: false
        },
        description: {
            required  : false,
            type      : String,
            maxlength : 1000,
        },
        members: {
            required : true,
            type     : [BoardMember],
            default  : []
        },
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

boardSchema.methods.setOwner = function(idUser) {
    let actualOwner = this.members.find(sub => sub.idUser.equals(idUser));
    if (!isNullOrUndefined(actualOwner)) {
        return actualOwner;
    } else {
        actualOwner = {
            idOwner: idUser,
            subscriberType: 'owner'
        };
        this._owner.push(actualOwner);
        return actualOwner;
    }
};

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
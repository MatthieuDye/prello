const mongoose = require('mongoose');
const Subscriber = require('./Subscriber');
const isNullOrUndefined = require("mongoose");

const Schema = mongoose.Schema;

const boardSchema = new Schema({
        name: {
            required  : true,
            minlength : 3,
            maxlength : 100,
            type      : String
        },
        desc: {
            required  : false,
            type      : String,
            maxlength : 1000,
        },
        subscribers: {
            required : true,
            type     : [Subscriber],
            default  : []
        },
        closed : {
            required : true,
            type : Boolean,
            default : false
        },
        prefs: {
            background : {
                required  : false,
                default   : "#FFFFFF",
                type      : String,
                match     : [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please, provide a color code in hexa format (#000000).']
            }
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
            sky : {
                type : String,
                default : ""
            },
            lime : {
                type : String,
                default : ""
            },
            pink : {
                type : String,
                default : ""
            },
            black : {
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
    let actualOwner = this.subscribers.find(sub => sub.idUser.equals(idUser));
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

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
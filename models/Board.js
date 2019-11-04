let mongoose = require('mongoose');
let List = require('./List');
let idValidator = require('mongoose-id-validator');

let Schema = mongoose.Schema;

let boardSchema = new Schema({
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
        closed : {
            required : true,
            type : Boolean,
            default : false
        },

        prefs: {
            background : {
                required  : true,
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

boardSchema.plugin(idValidator);


boardSchema.virtual('labels', {
    ref: 'Label', // The model to use
    localField: '_id', // Find people where `localField`
    foreignField: 'idBoard' // is equal to `foreignField`
});





//boardSchema.plugin(uniqueValidator);

let Board = mongoose.model('Board', boardSchema);

module.exports = Board;
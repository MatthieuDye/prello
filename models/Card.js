let mongoose = require('mongoose');
let idValidator = require('mongoose-id-validator');

let Schema = mongoose.Schema;

let cardSchema = new Schema({
        name: {
            type : String,
            minlength : 3,
            maxlength : 100
        },
        desc: {
            type : String,
            maxlength : 3000
        },
        pos: {
            type : Number,
            required : true,
        },
        due :  {
            type : Date,
            default : null
        },
        dueComplete : {
            default : false,
            type: Boolean
        },
        idList : {
            type: mongoose.Schema.ObjectId,
            ref : 'List',
            required : true
        },
        idBoard : {
            required  : true,
            type      : Schema.Types.ObjectId,
            ref : 'Board'
        },
        idLabels : {
            type : [{
                type : mongoose.Schema.ObjectId,
                ref : 'Label'
            }],
            default : []
        },
        closed : {
            type : Boolean,
            required : true,
            default : false
        }
    },
    {
        toJSON: { virtuals: true },
        versionKey: false
    });

//cardSchema.plugin(idValidator);

cardSchema.virtual('checklists', {
    ref: 'Checklist', // The model to use
    localField: '_id', // Find people where `localField`
    foreignField: 'idCard' // is equal to `foreignField`
});

cardSchema.virtual('comments', {
    ref: 'Comment', // The model to use
    localField: '_id', // Find people where `localField`
    foreignField: 'idCard', // is equal to `foreignField`
    options: { sort: { date: 1 }}
});

let Card = mongoose.model('Card', cardSchema);

module.exports = Card;
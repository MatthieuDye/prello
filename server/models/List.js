let mongoose = require('mongoose');
let Board = require('./Board');
let Schema = mongoose.Schema;

let listSchema = new Schema({
        name: {
            required  : true,
            minlength : 1,
            maxlength : 100,
            type      : String
        },
        closed : {
            required  : true,
            type      : Boolean,
            default   : false
        },
        idBoard : {
            required  : true,
            type      : Schema.Types.ObjectId,
            ref : 'Board'
        },
        pos : {
            required  : true,
            type      : Number
        }
    },
    {
        toJSON: { virtuals: true },
        versionKey: false
    });

listSchema.virtual('cards', {
    ref: 'Card', // The model to use
    localField: '_id', // Find people where `localField`
    foreignField: 'idList' // is equal to `foreignField`
});

let List = mongoose.model('List', listSchema);

module.exports = List;
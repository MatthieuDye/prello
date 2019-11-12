let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let checkItemSchema = new Schema({
        title: {
            type : String,
            required : true,
            minlength : 1,
            maxlength : 100
        },
        idChecklist: {
            type: mongoose.Types.ObjectId,
            ref: 'Checklist',
            required : true
        },
        isCompleted: {
            type : Boolean,
            required : true,
            default : false,
        },
        pos: {
            type : Number,
            required : true
        }
    },
    {
        toJSON: { virtuals: true },
        versionKey : false
    });

let CheckItem = mongoose.model('CheckItem', checkItemSchema);

module.exports = CheckItem;
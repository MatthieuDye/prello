let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let idValidator = require('mongoose-id-validator');


let labelSchema = new Schema({
        name : {
            type : String,
            required : true,
            minlength : 1,
            maxlength : 100
        },
        color : {
            type : String,
            required : true,
            match     : [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please, provide a color code in hexa format (#000000).']
        },
        idBoard: {
            type : mongoose.Types.ObjectId,
            ref : 'Board',
            required : true
        }
    },
    {
        toJSON: { virtuals: true },
        versionKey: false
    });

labelSchema.pre('remove', function (next) {
    var label = this;
    label.model('Card').updateMany(
        { idLabels: {$in: label._id}},
        { $pull: { idLabels :  label._id } },
        { multi: true },
        next
    );
});

labelSchema.plugin(idValidator);

let Label = mongoose.model('Label', labelSchema);
module.exports = Label;
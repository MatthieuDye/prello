let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let idValidator = require('mongoose-id-validator');


let labelSchema = new Schema({
        });

let Label = mongoose.model('Label', labelSchema);
module.exports = Label;
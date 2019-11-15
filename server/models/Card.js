let mongoose = require('mongoose');
let idValidator = require('mongoose-id-validator');

let Schema = mongoose.Schema;

let cardSchema = new Schema({
        });

let Card = mongoose.model('Card', cardSchema);

module.exports = Card;
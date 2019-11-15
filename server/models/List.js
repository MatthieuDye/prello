let mongoose = require('mongoose');
let Board = require('./Board');
let Schema = mongoose.Schema;

let listSchema = new Schema({
        });

let List = mongoose.model('List', listSchema);

module.exports = List;
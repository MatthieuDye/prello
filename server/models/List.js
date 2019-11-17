let mongoose = require('mongoose');
let Board = require('./Board');
let Schema = mongoose.Schema;

let listSchema = new Schema({
        name: {
                type: String,
                required: true
        },
        isArchived: {
                type: Boolean,
                required: true,
                default: false
        },
        cards: [
                {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Card',
                        default: []
                }
        ],
});

let List = mongoose.model('List', listSchema);

module.exports = List;
let mongoose = require('mongoose');
let Board = require('./Board');
let Schema = mongoose.Schema;

let listSchema = new Schema({
        isArchived: {
                type: Boolean,
                required: true,
                default: false
        },
        name: {
                type: String,
                required: true
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
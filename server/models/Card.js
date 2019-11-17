let mongoose = require('mongoose');
let idValidator = require('mongoose-id-validator');

let Schema = mongoose.Schema;

let cardSchema = new Schema({
        name: {
                type: String,
                required: true
        },
        description: String,
        dueDate: {
                date: Date,
                isDone: {
                        type: Boolean,
                        default: false
                },
        },
        isArchived: {
                type: Boolean,
                required: true,
                default: false
        },

        labels: [
                {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Label',
                        default: []
                }
        ],
        members: [
                {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User'
                }

        ]
});

let Card = mongoose.model('Card', cardSchema);

module.exports = Card;
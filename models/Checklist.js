const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChecklistSchema = new Schema({
    title: {
        type : String,
        required : true,
        minlength : 1,
        maxlength : 100
    },
    idBoard: {
        type: mongoose.Types.ObjectId,
        ref: 'Board',
        required : true
    },
    idCard: {
        type: mongoose.Types.ObjectId,
        ref: 'Card',
        required : true
    },
    pos: {
        type: Number,
        required: true
    },
    items: {
        type : [{
            type : mongoose.Schema.ObjectId,
            ref : 'Checkitem'
        }],
        default : []
    }

}, {timestamps: true});

const Checklist = mongoose.model('Team', ChecklistSchema, 'Teams');
module.exports = Checklist;
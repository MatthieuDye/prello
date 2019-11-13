const mongoose = require("mongoose");
const TeamMember = require('./TeamMember');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    name: {type: String, required: true},
    description: String,
    boards: [{
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        default : []
    }],
    members: {
        required: true,
        type: [TeamMember],
        default: []
    },
}, {timestamps: true});

const Team = mongoose.model('Team', TeamSchema, 'Teams');
module.exports = Team;
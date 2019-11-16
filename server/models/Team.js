const mongoose = require("mongoose");

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
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {timestamps: true});

const Team = mongoose.model('Team', TeamSchema, 'Teams');
module.exports = Team;
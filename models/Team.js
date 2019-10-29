const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    urlAvatar: String,
    admins: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    description: String,
    name: {type: String, required: true},
    boards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board'
    }],
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
}, {timestamps: true});

const Team = mongoose.model('Team', TeamSchema, 'Teams');
module.exports = Team;
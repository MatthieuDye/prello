const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let TeamMemberSchema = new Schema({
        idUser: {
            required  : true,
            type      : Schema.Types.ObjectId,
            ref : 'User'
        },
        isAdmin: {
            type: Boolean,
            required : true,
            default : false
        }
    }, {timestamps: true});


module.exports = TeamMemberSchema;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  firstName: {
    required : true,
    type: String,
    minlength : 2,
    maxlength : 50
  },
  lastName: {
    required  : true,
    minlength : 2,
    maxlength : 50,
    type      : String
  },
  userName: {
    required : true,
    unique : true,
    minLength : 3,
    maxLength : 30,
    type : String
  },
  email: {
    type: String,
    trim: true,
    index: true,
    unique: true,
    required: true,
    sparse: true,
    maxlength : 100,
    match    : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  guestBoards: {
    type : [
      {
        type : Schema.Types.ObjectId,
        ref : 'Board'
      }
    ],
    default : [],
    required : true
  },
  teams: {
    type : [
      {
        type : Schema.Types.ObjectId,
        ref : 'Team'
      }
    ],
    default : [],
    required : true
  }
});
const User = mongoose.model('User', UserSchema, 'Users');
module.exports = User;
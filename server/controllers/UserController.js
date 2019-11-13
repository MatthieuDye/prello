const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/database/keys");
const cors = require("cors");

var ObjectID = require('mongodb').ObjectID;

// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const validateUpdateUserInput = require("../validation/updateUser");

// Load User model
const User = require("../models/User");

router.use(cors());

const UserController = () => {

  // @route POST api/users/register
  // @desc Register user
  // @access Public
  const register = async (req, res) => {
    // Form validation

    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        return res.status(400).json({ email: "Email already exists" });
      } else {
        User.findOne({ userName: req.body.userName }).then(user => {
          if (user) {
            return res.status(400).json({ userName: "Username already exists" });
          } else {
            const newUser = new User({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              userName: req.body.userName,
              email: req.body.email,
              password: req.body.password
            });
            console.log(newUser)

            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => res.json(user))
                  .catch(err => console.log(err));
              });
            });
          }
        });
      }
    });
  };

  // @route POST api/users/login
  // @desc Login user and return JWT token
  // @access Public
  const login = async (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(422).json({error: "Email or password invalid"});
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({ email }).then(user => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ emailnotfound: "Email not found" });
      }

      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email
          };

          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 3600 // 1 hour in seconds
            },
            (err, token) => {
              res.status(201).json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          return res
            .status(404)
            .json({ passwordincorrect: "Incorrect email or password" });
        }
      });
    });
  };

  const updateProfile = async (req, res) => {
    const { id, update } = req.body

    // Form validation
    const { errors, isValid } = validateUpdateUserInput(update);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    User.findOne({ email: update.email, _id: { $ne: Object(id) } }).then(user => {
      if (user) {
        return res.status(400).json({ email: "Email already exists" });
      } else {
        User.findOne({ userName: update.userName, _id: { $ne: Object(id) } }).then(user => {
          if (user) {
            return res.status(400).json({ userName: "Username already exists" });
          } else {
            User.updateOne(
              { "_id": ObjectID(id) },
              {
                $set: {
                  "firstName": update.firstName,
                  "lastName": update.lastName,
                  "userName": update.userName,
                  "email": update.email
                }
              },
              (err) => {
                if (err) return res.json({ success: false, error: err });
                return res.json({ success: true });
              }
            );
          }
        });
      }
    });
  };

  return {
    register,
    login,
    updateProfile
  };
};

module.exports = UserController;
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const qs = require('query-string');
const passport = require("passport");


//const passport = require("passport");
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
      return res.status(422).json({ message: "Invalid input" });
    }

    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        return res.status(409).json({ message: "Email already exists" });
      } else {
        User.findOne({ userName: req.body.userName }).then(user => {
          if (user) {
            return res.status(409).json({ message: "Username already exists" });
          } else {
            const newUser = new User({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              userName: req.body.userName,
              email: req.body.email,
              password: req.body.password
            });

            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => res.status(201).json(user))
                  .catch(err => res.status(500).json({ message: "Server error " + err }));
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
      return res.status(422).json({ message: "Email or password invalid" });
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({ email }).then(user => {
      // Check if user exists
      if (!user) {
        return res.status(403).json({ message: "Invalid credentials" });
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
              process.env.SECRET_TOKEN,
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
            .status(403)
            .json({ message: "Invalid credentials" });
        }
      });
    });
  };

  const updateProfile = async (req, res) => {
    // Form validation
    const { errors, isValid } = validateUpdateUserInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(422).json({ message: "Invalid input" });
    }

    User.findOne({ email: req.body.email, userName: { $ne: req.params.userName } }).then(user => {
      if (user) {
        return res.status(409).json({ email: "Email already exists" });
      } else {
        User.findOne({ userName: req.body.userName }).then(user => {
          if (user && user.userName != req.params.userName) {
            return res.status(409).json({ userName: "Username already exists" });
          } else {
            User.updateOne(
              { "userName": req.params.userName },
              {
                $set: {
                  "firstName": req.body.firstName,
                  "lastName": req.body.lastName,
                  "userName": req.body.userName,
                  "email": req.body.email
                }
              },
            )
              .then(user => res.status(201).json(user))
              .catch(err => res.status(404).json({ message: "User not found " + err }))
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
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const cors = require("cors");
const { google } = require('googleapis');

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
      return res.status(400).json(errors);
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
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
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

  const googleAuth = async (req, res) => {

    const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URL
    );

    const defaultScope = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];

    const url = auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: defaultScope
    });


    return res.status(201).json({ url: url });

  };

  const googleAuthCallback = async (req, res) => {

    const data = await auth.getToken(code);
    const tokens = data.tokens;
    const auth = createConnection();
    auth.setCredentials(tokens);
    const plus = getGooglePlusApi(auth);
    const me = await plus.people.get({ userId: 'me' });
    const userGoogleId = me.data.id;
    const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
    return {
      id: userGoogleId,
      email: userGoogleEmail,
      tokens: tokens,
    };
  };


  return {
    register,
    login,
    updateProfile,
    googleAuth,
    googleAuthCallback
  };
};

module.exports = UserController;
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
const validateIdParam = require("../validation/idParam");

// Load User model
const User = require("../models/User");
const Board = require("../models/Board");

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
      return res.status(422).json({ message: errors });
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
                  .then(user => res.status(201).json({ user: user }))
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
      return res.status(422).json({ message: errors});
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


  const loginPolytech = async (req, res) => {

     const verify = jwt.verify(req.body.token, process.env.AUTH_POLYTECH_SECRET);

     if (!verify) {
         return res.status(401).json({ message: "Unauthorized request"});
     }


    const user = req.body.user ;
    const username = user.firstname.toLowerCase() + "." + user.lastname.toLowerCase();

    let userId = new ObjectID();


    // Find user by email
    User.findOne({userName: username})
        .then(existingUser => {
          if (!existingUser) {
            new User({
              _id: userId,
              firstName: user.firstname,
              lastName: user.lastname,
              userName: username,
              email: username + "@etu.umontpellier.fr",
              password: "polytech"
            })
                .save()
                .then(a => {
                  // Create JWT Payload
                  const payload = {
                    _id: userId,
                    firstName: user.firstname,
                    lastName: user.lastname,
                    userName: username,
                    email: username + "@etu.umontpellier.fr",
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
                })
          } else {
            // Create JWT Payload
            const payload = {
              id: existingUser._id,
              firstName: existingUser.firstName,
              lastName: existingUser.lastName,
              userName: existingUser.userName,
              email: existingUser.email
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

          }
        })
  };


  /**
     * Get a user by id
     * @param {string} id.path.required - user's id.
     * @returns {User.model} 201 - User object
     */
  const getUser = async (req, res) => {
    const id = req.params.id;

    // User Id validation
    const { errors, idIsValid } = validateIdParam(id);
    if (!idIsValid) {
      return res.status(422).json({ message: errors.name });
    }

    User.findOne({ _id: Object(id) }).then(user => {
      if (user) {
        return res.status(201).json({ user: user, message: "User found" })
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    }).catch(err => {
      res.status(404).json({ message: "User not found " + err });
    });
  };
  //put /user/:userId/board/favorite/:boardId

  const updateFavoriteBoards = async (req, res) => {

    const {boardId, userId} = req.params;
    const isFavorite = req.body.isFavorite;

    // Board Id validation
    if (!validateIdParam(boardId).idIsValid) {
      return res.status(422).json({message: validateIdParam(boardId).errors.name});
    }

    // User Id validation
    if (!validateIdParam(userId).idIsValid) {
      return res.status(422).json({message: validateIdParam(userId).errors.name});
    }

    User.findOne({_id: userId}).then(user => {
          if (user) {
            Board.findOne({_id: boardId}).then(board => {
              if (board) {
                if (isFavorite) {
                  User.updateOne({_id: user._id}, {
                    $addToSet: {
                      favoriteBoards: board._id
                    }
                  }).then(() =>
                      User
                          .findOne({_id: user._id})
                          .then(userFounded => {
                                return res.status(201).send({user: userFounded, message: 'User successfully updated'})
                              }
                          ))
                } else {
                  User.updateOne({_id: user.userId}, {
                    $pull: {
                      favoriteBoards: board._id
                    }
                  }).then(() =>
                      User
                          .findOne({_id: userId})
                          .then(userFounded => {
                                return res.status(201).send({user: userFounded, message: 'User successfully updated'})
                              }
                          ))
                }
              } else {
                return res.status(404).json({message: "This board does not exists"})
              }
            })
          } else {
            return res.status(404).json({message: "This user does not exists"})
          }
        }
    )
  };

  const findByBeginName = async (req, res) => {

    const query = req.params.query;

    User.find({ "userName": { $regex: `^${query}`, $options: 'i' } })
      .then(users => {
        res.status(201).send({
          users: users,
          message: 'Users successfully fetched'
        })
      })
      .catch(err => {
        return res.status(404).json({ message: "This query found no user - " + err });
      })
  };

  const updateProfile = async (req, res) => {
    // Form validation
    const { errors, isValid } = validateUpdateUserInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(422).json({ message: errors });
    }

    User.findOne({ email: req.body.email, userName: { $ne: req.params.userName } }).then(user => {
      if (user) {
        return res.status(409).json({ message: "Email already exists" });
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
              .then(user => {
                User.findOne({ userName: req.params.userName })
                  .then(user => res.status(201).json({ user: user, message: "User updated" }))
              })
              .catch(err => res.status(404).json({ message: "User not found " + err }))
          }
        });
      }
    });
  };

  const getBoardsByUserId = async (req, res) => {
    const userId = req.params.userId;
    // User Id validation
    const { errors, idIsValid } = validateIdParam(userId);
    if (!idIsValid) {
      return res.status(422).json({ message: errors.name });
    }

    User.findById(userId)
      .select('boards')
      .populate([{
        path: 'guestBoards',
        select: ['name', 'description']
      }, {
        path: 'teams',
        select: ['name'],
        populate: ({
          path: 'boards',
          select: ['name', 'description']
        })
      }
      ])
      .then(user => res.status(201).send({
        boards: { guestBoards: user.guestBoards, teamsBoards: user.teams },
        message: 'Boards successfully fetched'
      }))
      .catch(err => {
        return res.status(404).json({ message: "This user does not exists" });
      })

  };

  const getTeamsByUserId = async (req, res) => {
    const userId = req.params.userId;

    // User Id validation
    const { errors, idIsValid } = validateIdParam(userId);
    if (!idIsValid) {
      return res.status(422).json({ message: errors.name });
    }

    User.findById(userId)
      .select('teams')
      .populate({
        path: 'teams',
        select: ['name', 'description', 'members']
      })
      .then(user => res.status(201).send({ teams: user.teams, message: 'Teams successfully fetched' }))
      .catch(err => {
        return res.status(404).json({ message: "This user does not exists" });
      })

  };

  return {
    register,
    login,
    getUser,
    updateProfile,
    findByBeginName,
    loginPolytech,
    updateFavoriteBoards,
    getBoardsByUserId,
    getTeamsByUserId
  };
};

module.exports = UserController;
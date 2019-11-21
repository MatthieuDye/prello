const express = require("express");
const router = express.Router();
const cors = require("cors");

// Load models
const Board = require("../models/Board");
const Label = require('../models/Label');
const List = require('../models/List');
const User = require('../models/User');
const Team = require('../models/Team');

// Load input validation
const validateCreateBoardInput = require("../validation/createBoard.js");
const validateIdParam = require("../validation/idParam");

router.use(cors());

const BoardController = () => {

    /**
     * Create a board
     * @param board.body.required - board's information.
     * @returns {Board.model} 201 - Board created
     */
    const createBoard = async (req, res) => {
        // Form validation
        const { errors, isValid } = validateCreateBoardInput(req.body);

        // Check validation
        if (!isValid) {
            return res.status(422).json({ message: "Invalid input" });
        }

        Board.findOne({ name: req.body.name }).then(board => {
            if (board) {
                return res.status(409).json({ boardName: "This board name already exists" });
            } else {
                const newBoard = new Board({
                    name: req.body.name,
                    description: req.body.description,
                    guestMembers: [req.body.userId],
                    admins: [req.body.userId],
                });
                newBoard
                    .save()
                    .then(board => {
                        //Add the team to the user team list
                        Board.findById(board.id)
                            .then(
                                User.findById(req.body.userId)
                                    .then(
                                        User.updateOne({ _id: req.body.userId }, {
                                            $addToSet: {
                                                guestBoards: board.id,
                                            }
                                        })
                                            .then()
                                            .catch(err => res.send({ message: err }))
                                    )
                                    .catch(err => res.status(404).json({ message: "This user does not exists " + err }))
                            )
                            .catch(err => res.status(404).json({ message: "This team does not exists " + err }));
                        res.status(201).send({ message: 'Board successfully created', board: board })
                    })
                    .catch(err => res.status(500).json({ message: "Server error " + err }));
            }
        });
    };

    /**
     * Get a board by id
     * @param {string} id.path.required - board's id.
     * @returns {Board.model} 201 - Board object
     */
    const getBoard = async (req, res) => {
        const id = req.params.id;

        // Board Id validation
        const { errors, idIsValid } = validateIdParam(id);
        if (!idIsValid) {
            return res.status(422).json({ message: errors.name });
        }

        Board.findOne({ _id: Object(id) }).then(board => {
            if (board) {
                return res.status(201).json({ board: board, message: "Board found" })
            } else {
                return res.status(404).json({ message: "Board not found" });
            }
        }).catch(err => {
            res.status(404).json({ message: "Board not found " + err });
        });
    };

    /**
     * Update a board
     * @param {string} id.path.required - board's id.
     * @returns {Board.model} 201 - Board object
     */
    const updateBoard = async (req, res) => {
        const id = req.params.id;

        // Board Id validation
        if (!validateIdParam(id).idIsValid) {
            return res.status(422).json({ message: validateIdParam(id).errors.name });
        }

        // Form validation
        const { errors, isValid } = validateCreateBoardInput(req.body);

        // Check validation
        if (!isValid) {
            return res.status(422).json({ message: "Invalid input" });
        }

        //Search the board
        Board.findOne({ _id: Object(id) })
            .then(board => {
                //If the board exists
                if (board) {
                    //Rename the board
                    Board.updateOne(
                        { _id: Object(id) },
                        {
                            $set: {
                                "name": req.body.name,
                                "description": req.body.description
                            }
                        },
                    )
                        .then(board => {
                            //Get the board to return
                            Board.findOne({ _id: Object(id) })
                                .populate([{
                                    path: 'lists',
                                    select: ['name', 'isArchived', 'cards'],
                                    populate: ({
                                        path: 'cards',
                                        select: ['name', 'description', 'dueDate', 'labels', 'members', 'isArchived']
                                    })
                                }, {
                                    path: 'guestMembers',
                                    select: ['firstName', 'lastName']
                                }, {
                                    path: 'team',
                                    select: ['name', 'members'],
                                    populate: ({
                                        path: 'members',
                                        select: ['name', 'lastName']
                                    })
                                }])
                                .then(board => res.status(201).json({ board: board, message: "Board renamed" }))
                                .catch(err => res.status(404).json({ message: "Board not found - " + err }))
                        })
                        .catch(err => res.status(404).json({ message: "Board not found - " + err }))
                } else {
                    return res.status(404).json({ message: "Board not found" })
                }
            })
            .catch(err => res.status(404).json({ message: "Board not found - " + err }))
    };

    // @route PUT api/private/board/admin/:boardId/add/user/:memberId
    // @desc add a user to the team
    // @access Auth users
    const addMember = async (req, res) => {
        const { boardId, memberUserName } = req.params;

        // Board Id validation
        if (!validateIdParam(boardId).idIsValid) {
            return res.status(422).json({ message: validateIdParam(boardId).errors.name });
        }

        //Search if the board exists
        Board.findOne({ _id: boardId })
            .then(board => {
                //If the board exists
                if (board) {
                    //Search if the user exists
                    User.findOne({ userName: memberUserName })
                        .then(user => {
                            //If the user exists
                            if (user) {
                                //Add the user to the board
                                Board
                                    .findOneAndUpdate({ _id: boardId }, {
                                        $addToSet: {
                                            guestMembers: user._id,
                                        },
                                    })
                                    .then(board => {
                                        //Add the board to the user guestBoards list
                                        User.updateOne({ userName: memberUserName }, {
                                            $addToSet: {
                                                guestBoards: boardId,
                                            }
                                        })
                                            .then(e => {
                                                //Get the board to return
                                                Board.findById(boardId)
                                                    .populate([{
                                                        path: 'lists',
                                                        select: ['name', 'isArchived', 'cards'],
                                                        populate: ({
                                                            path: 'cards',
                                                            select: ['name', 'description', 'dueDate', 'labels', 'members', 'isArchived']
                                                        })
                                                    }, {
                                                        path: 'guestMembers',
                                                        select: ['firstName', 'lastName']
                                                    }, {
                                                        path: 'team',
                                                        select: ['name', 'members'],
                                                        populate: ({
                                                            path: 'members',
                                                            select: ['name', 'lastName']
                                                        })
                                                    }])
                                                    .then(board => {
                                                        res.status(201).send({ board: board, message: 'User successfully added to the board' })
                                                    })
                                                    .catch(err => res.status(404).json({ message: "This user does not exists - " + err }));
                                            })
                                            .catch(err => res.status(404).json({ message: "This user does not exists - " + err }));
                                    })
                                    .catch(err => res.status(404).json({ message: "This board does not exists - " + err }));
                            } else {
                                return res.status(404).json({ message: "This user does not exists" })
                            }
                        })
                        .catch(err => res.status(404).json({ message: "This user does not exists - " + err }))
                } else {
                    return res.status(404).json({ message: "This board does not exists" })
                }


            })
            .catch(err => res.status(404).json({ message: "This board does not exists - " + err }))
    };

    // @route DELETE api/board/admin/:teamId/delete/user/:memberId
    // @desc add a user to the team
    // @access Auth users

    const deleteMember = async (req, res) => {
        const { boardId, memberId } = req.params;

        // Board Id validation
        if (!validateIdParam(boardId).idIsValid) {
            return res.status(422).json({ message: validateIdParam(boardId).errors.name });
        }

        // User Id validation
        if (!validateIdParam(memberId).idIsValid) {
            return res.status(422).json({ message: validateIdParam(memberId).errors.name });
        }

        //Search if the board exists
        Board.findOne({ _id: boardId })
            .then(board => {
                //If the board exists
                if (board) {
                    //Search if the user exists
                    User.findOne({ _id: memberId })
                        .then(user => {
                            //If the user exists
                            if (user) {
                                //Delete the user from the board
                                Board.updateOne({ _id: boardId }, {
                                    $pull: {
                                        guestMembers: memberId,
                                        admins: memberId,
                                    }
                                })
                                    .then(board => {
                                        //Delete the board from guestBoards list
                                        User.updateOne({ _id: memberId }, {
                                            $pull: {
                                                guestBoards: boardId
                                            }
                                        })
                                            .then(e => {
                                                Board.findById(boardId)
                                                    .populate([{
                                                        path: 'lists',
                                                        select: ['name', 'isArchived', 'cards'],
                                                        populate: ({
                                                            path: 'cards',
                                                            select: ['name', 'description', 'dueDate', 'labels', 'members', 'isArchived']
                                                        })
                                                    }, {
                                                        path: 'guestMembers',
                                                        select: ['firstName', 'lastName']
                                                    }, {
                                                        path: 'team',
                                                        select: ['name', 'members'],
                                                        populate: ({
                                                            path: 'members',
                                                            select: ['name', 'lastName']
                                                        })
                                                    }])
                                                    .then(board => {
                                                        res.status(201).send({ board: board, message: 'User successfully deleted from the board' })
                                                    })
                                                    .catch(err => res.status(404).json({ message: "This user does not exists - " + err }))
                                            })
                                            .catch(err => res.status(404).json({ message: "This user does not exists - " + err }))
                                    })
                                    .catch(err => res.status(404).json({ message: "This board does not exists - " + err }))
                            } else {
                                return res.status(404).json({ message: "This user does not exists" })
                            }
                        })
                        .catch(err => res.status(404).json({ message: "This user does not exists - " + err }))
                } else {
                    return res.status(404).json({ message: "This board does not exists" })
                }


            })
            .catch(err => res.status(404).json({ message: "This board does not exists - " + err }))
    };

    // @route PUT api/board/admin/:boardId/update/user/role/:memberId
    // @desc add a user to the team
    // @access Auth users

    const updateMemberRole = async (req, res) => {
        const { boardId, memberId } = req.params;

        // Board Id validation
        if (!validateIdParam(boardId).idIsValid) {
            return res.status(422).json({ message: validateIdParam(boardId).errors.name });
        }

        // User Id validation
        if (!validateIdParam(memberId).idIsValid) {
            return res.status(422).json({ message: validateIdParam(memberId).errors.name });
        }

        if (req.body.isAdmin != false && req.body.isAdmin != true) {
            return res.status(422).json({ message: "isAdmin is invalid" });
        }

        //Search if the board exists
        Board.findOne({ _id: boardId })
            .then(board => {
                //If the board exists
                if (board) {
                    //Search if the user exists
                    User.findOne({ _id: memberId })
                        .then(user => {
                            //If the user exists
                            if (user) {
                                if (req.body.isAdmin) {
                                    // add to admin collection
                                    Board.updateOne({ _id: boardId }, { $addToSet: { admins: memberId } })
                                        .then(board => {
                                            Board.findById(req.params.boardId)
                                                .populate([{
                                                    path: 'lists',
                                                    select: ['name', 'isArchived', 'cards'],
                                                    populate: ({
                                                        path: 'cards',
                                                        select: ['name', 'description', 'dueDate', 'labels', 'members', 'isArchived']
                                                    })
                                                }, {
                                                    path: 'guestMembers',
                                                    select: ['firstName', 'lastName']
                                                }, {
                                                    path: 'team',
                                                    select: ['name', 'members'],
                                                    populate: ({
                                                        path: 'members',
                                                        select: ['name', 'lastName']
                                                    })
                                                }])
                                                .then(board => {
                                                    res.status(201).send({ board: board, message: 'User role successfully updated in the board' });
                                                })
                                                .catch(err => res.status(404).json({ message: "This Board does not exists - " + err }));
                                        })
                                        .catch(err => res.status(404).json({ message: "This Board does not exists - " + err }));
                                } else {
                                    Board.updateOne({ _id: boardId }, { $pull: { admins: memberId } })
                                        .then(board => {
                                            Board.findById(req.params.boardId)
                                                .populate([{
                                                    path: 'lists',
                                                    select: ['name', 'isArchived', 'cards'],
                                                    populate: ({
                                                        path: 'cards',
                                                        select: ['name', 'description', 'dueDate', 'labels', 'members', 'isArchived']
                                                    })
                                                }, {
                                                    path: 'guestMembers',
                                                    select: ['firstName', 'lastName']
                                                }, {
                                                    path: 'team',
                                                    select: ['name', 'members'],
                                                    populate: ({
                                                        path: 'members',
                                                        select: ['name', 'lastName']
                                                    })
                                                }])
                                                .then(board => {
                                                    res.status(201).send({ board: board, message: 'User role successfully updated in the board' });
                                                })
                                                .catch(err => res.status(404).json({ message: "This Board does not exists - " + err }));
                                        })
                                        .catch(err => res.status(404).json({ message: "This Board does not exists - " + err }));
                                }
                            } else {
                                return res.status(404).json({ message: "This user does not exists" })
                            }
                        })
                        .catch(err => res.status(404).json({ message: "This user does not exists - " + err }))
                } else {
                    return res.status(404).json({ message: "This board does not exists" })
                }
            })
            .catch(err => res.status(404).json({ message: "This board does not exists - " + err }))

    };


    // @route POST api/board/admin/:boardId/add/team/:teamId
    // @desc add a team to the board
    // @access Auth users

    const addTeam = async (req, res) => {
        const { boardId, teamName } = req.params;

        // Board Id validation
        if (!validateIdParam(boardId).idIsValid) {
            return res.status(422).json({ message: validateIdParam(boardId).errors.name });
        }

        Board.findOne({ _id: boardId })
            .then(board => {
                //If the board exists
                if (board) {
                    //Search if the team exists
                    Team.findOne({ name: teamName })
                        .then(team => {
                            //If the team exists
                            if (team) {
                                Board
                                    .updateOne({ _id: boardId }, {
                                        $set: {
                                            "team": team._id
                                        },
                                    })
                                    .then(board => {
                                        //Add the team to the user team list
                                        Team.updateOne({ name: teamName }, {
                                            $addToSet: {
                                                boards: boardId
                                            }
                                        })
                                            .then((a) => {
                                                Board
                                                    .findById(boardId)
                                                    .populate([{
                                                        path: 'lists',
                                                        select: ['name', 'isArchived', 'cards'],
                                                        populate: ({
                                                            path: 'cards',
                                                            select: ['name', 'description', 'dueDate', 'labels', 'members', 'isArchived']
                                                        })
                                                    }, {
                                                        path: 'guestMembers',
                                                        select: ['firstName', 'lastName']
                                                    }, {
                                                        path: 'team',
                                                        select: ['name', 'members'],
                                                        populate: ({
                                                            path: 'members',
                                                            select: ['name', 'lastName']
                                                        })
                                                    }])
                                                    .then(board => { res.status(201).send({ board: board, message: 'Team successfully added to the board' }) })
                                                    .catch(err => res.status(404).json({ message: "This team does not exists - " + err }));
                                            })
                                            .catch(err => res.status(404).json({ message: "This team does not exists - " + err }));

                                    })
                                    .catch(err => res.status(404).json({ message: "This Board does not exists - " + err }));
                            } else {
                                return res.status(404).json({ message: "This team does not exists" })
                            }
                        })
                        .catch(err => res.status(404).json({ message: "This team does not exists - " + err }))
                } else {
                    return res.status(404).json({ message: "This board does not exists" })
                }
            })
            .catch(err => res.status(404).json({ message: "This board does not exists - " + err }))
    };

    const deleteTeam = async (req, res) => {
        const { boardId, teamId } = req.params;

        // Board Id validation
        if (!validateIdParam(boardId).idIsValid) {
            return res.status(422).json({ message: validateIdParam(boardId).errors.name });
        }

        // Team Id validation
        if (!validateIdParam(teamId).idIsValid) {
            return res.status(422).json({ message: validateIdParam(teamId).errors.name });
        }


        Board.findOne({ _id: boardId })
            .then(board => {
                //If the board exists
                if (board) {
                    //Search if the team exists
                    Team.findOne({ _id: teamId })
                        .then(teamFounded => {
                            //If the team exists
                            if (teamFounded) {
                                Board
                                    .updateOne({ _id: boardId }, {
                                        $unset: {
                                            "team": ""
                                        },
                                        $pullAll: {
                                            "admins": teamFounded.members
                                        }
                                    })
                                    .then(board => {
                                        //Add the team to the user team list
                                        Team.updateOne({ _id: teamId }, {
                                            $pull: {
                                                boards: boardId,
                                            }
                                        })
                                            .then(e =>
                                                Board.findById(boardId)
                                                    .populate([{
                                                        path: 'lists',
                                                        select: ['name', 'isArchived', 'cards'],
                                                        populate: ({
                                                            path: 'cards',
                                                            select: ['name', 'description', 'dueDate', 'labels', 'members', 'isArchived']
                                                        })
                                                    }, {
                                                        path: 'guestMembers',
                                                        select: ['firstName', 'lastName']
                                                    },{
                                                        path: 'team',
                                                        select: ['name', 'members'],
                                                        populate: ({
                                                            path: 'members',
                                                            select: ['name', 'lastName']
                                                        })
                                                    }])
                                                    .then(boardDone => {
                                                        res.status(201).send({
                                                            board: boardDone,
                                                            message: 'Team successfully removed from the board'
                                                        })
                                                    })
                                                    .catch(err => res.status(404).json({ message: "This team does not exists - " + err })))
                                            .catch(err => res.status(404).json({ message: "This team does not exists - " + err }));
                                    })
                                    .catch(err => res.status(404).json({ message: "This Board does not exists - " + err }));
                            } else {
                                return res.status(404).json({ message: "This team does not exists" })
                            }
                        })
                        .catch(err => res.status(404).json({ message: "This team does not exists - " + err }))
                } else {
                    return res.status(404).json({ message: "This board does not exists" })
                }
            })
            .catch(err => res.status(404).json({ message: "This board does not exists - " + err }))

    };

    /**
     * Get all informations for a board
     * @param {string} boardId.path.required - board's id.
     * @returns {Board.model} 201 - Board object
     */
    const getAllBoardInfo = async (req, res) => {
        const boardId = req.params.boardId;

        // Board Id validation
        const { errors, idIsValid } = validateIdParam(boardId);
        if (!idIsValid) {
            return res.status(422).json({ message: errors.name });
        }

        Board.findById(boardId)
            .populate([{
                path: 'lists',
                select: ['name', 'isArchived', 'cards'],
                populate: ({
                    path: 'cards',
                    select: ['name', 'description', 'dueDate', 'labels', 'members', 'isArchived']
                })
            }, {
                path: 'guestMembers',
                select: ['firstName', 'lastName']
            }, {
                path: 'team',
                select: ['name', 'members'],
                populate: ({
                    path: 'members',
                    select: ['name', 'lastName']
                })
            }])
            .then(board => {
                res.status(201).send({
                    board: board,
                    message: 'Boards information successfully fetched'
                })
            })
            .catch(err => {
                return res.status(404).json({ message: "This board does not exists - " + err });
            })
        /*
                Board.findOne({ _id: Object(boardId) }).then(board => {
                    if (board) {
                        return res.status(201).json({ board: board, message: "Board found" })
                    } else {
                        return res.status(404).json({ message: "Board not found" });
                    }
                }).catch(err => {
                    res.status(404).json({ message: "Board not found " + err });
                });
                */
    };

    /**
     * Create a list on the board
     * @route POST /boards/{id}/lists
     * @group board - Operations about boards
     * @param {string} id.path.required - board's id.
     * @param list.body.required - list's information
     * @returns {List.model} 200 - List object
     * @returns {Error}  401 - Unauthorized, invalid credentials
     * @returns {Error}  404 - Not found, board is not found
     * @returns {Error}  default - Unexpected error
     * @security JWT
     */
    const addList = async (req, res) => {
        /*req.body.idBoard = req.params.id;

        Board.findById(req.params.id)
            .exec(function (err, board) {
                if (err) debug('POST boards/:id/lists error : ' + err);
                if (!board)
                    return res.status(404).json({ message: 'Board not found' });

                let newList = new List(req.body);
                newList.validate(function (err) {
                    if (err) return res.status(400).json({ message: err });

                    newList.save(function (err) {
                        if (err) {
                            debug('POST boards/:id/lists error : ' + err);
                            return res.status(500).json({ message: 'Unexpected internal error' });
                        }
                        res.status(201).json(newList);
                    });
                });
            }).then();*/
    }

    /**
     * Get lists of the board
     * @route GET /boards/{id}/lists
     * @group board - Operations about boards
     * @param {string} id.path.required - board's id.
     * @returns {Array.<List>} 200 - List object
     * @returns {Error}  401 - Unauthorized, invalid credentials
     * @returns {Error}  404 - Not found, board is not found
     * @returns {Error}  default - Unexpected error
     * @security JWT
     */
    const getLists = async (req, res) => {
        /*  req.query.idBoard = req.board._id;
          let openCard = false;
          if (req.query.cards) {
              if (req.query.cards === 'open') openCard = true;
              delete req.query.cards;
          }
          let query = List.find(req.query);
          if (openCard) query.populate('cards');
          query.exec(function (err, lists) {
              if (err) {
                  debug('GET boards/:id/lists error : ' + err)
                  return res.status(500).json({ message: 'Unexpected internal error' });
              }
              return res.status(200).json(lists)
          }).then();*/
    }

    /**
     * Create a label
     * @route POST /boards/{id}/labels
     * @group board - Operations about boards
     * @param {string} id.path.required - board's id.
     * @param {string} name.query.required - label's name.
     * @param {string} color.query.required - label's color.
     * @returns {Label.model} 200 - Label object
     * @returns {Error}  401 - Unauthorized, invalid credentials
     * @returns {Error}  403 - Forbidden, invalid credentials
     * @returns {Error}  404 - Not found, board is not found
     * @returns {Error}  default - Unexpected error
     * @security JWT
     */
    const addLabel = async (req, res) => {
        /*if (!req.query.name) return res.status(400).json({ message: 'Label name missing' });
        if (!req.query.color) return res.status(400).json({ message: 'Label color missing' });
 
        let label = new Label({ name: req.query.name, color: req.query.color, idBoard: req.board._id });
 
        label.validate(function (err) {
            if (err) return res.status(400).json({ message: err });
            label.save(function (err) {
                if (err) return res.status(500).json({ message: 'Unexpected internal error.' });
                return res.status(201).json(label);
            })
        })*/
    }

    return {
        createBoard,
        getBoard,
        updateBoard,
        addList,
        getLists,
        addLabel,
        addMember,
        deleteMember,
        updateMemberRole,
        addTeam,
        deleteTeam,
        getAllBoardInfo
    };
};

module.exports = BoardController;
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

        Board.findOne({ _id: Object(id) }).then(board => {
            if (board) {
                return res.status(201).json(board)
            } else {
                return res.status(404).json({ message: "Board not found" });
            }
        }).catch(err => {
            res.status(404).json({ message: "Board not found " + err });
        });
    };

    // /**
    //  * Update a board by id
    //  * @route PUT /boards/{id}
    //  * @group board - Operations about boards
    //  * @param {string} id.path.required - board's id
    //  * @param {string} name.query - board's name.
    //  * @param {string} desc.query - board's description.
    //  * @param {string} closed.query - board's archived or not.
    //  * @returns {code} 200 - Board updated successfully
    //  * @returns {Error}  401 - Unauthorized, invalid credentials
    //  * @returns {Error}  404 - Not found, board is not found
    //  * @returns {Error}  default - Unexpected error
    //  */
    // const updateBoard = async (req, res) => {
    //    let board = req.body.board;
    //
    //      (req.query.name) ? board.name = req.query.name : null;
    //      (req.query.desc) ? board.desc = req.query.desc : null;
    //      (req.query.closed) ? board.closed = req.query.closed : null;
    //
    //      board.validate(function (err) {
    //          if (err) return res.status(400).json({ message: err });
    //          board.save(function (err) {
    //              if (err) {
    //                  debug('PUT board/:id error : ' + err);
    //                  return res.status(500).json({ message: 'Unexpected internal error' });
    //              }
    //              return res.status(200).json({ message: 'Board updated successfully' });
    //          });
    //      });
    // }

    // @route PUT api/private/board/admin/:boardId/add/user/:memberId
    // @desc add a user to the team
    // @access Auth users
    const addMember = async (req, res) => {

        const board = Board.findById(req.params.boardId);
        const user = User.findById(req.params.memberId);

        if (!board) {
            return res.status(404).json({ teamName: "This board does not exists" });
        }
        if (!user) {
            return res.status(404).json({ teamName: "This user does not exists" });
        }

        console.log(req.body.isAdmin);

        if (req.body.isAdmin) {
            // add to admin collection
            await Board.updateOne({ _id: req.params.boardId }, { $addToSet: { admins: req.params.memberId } });
        }

        Board
            .updateOne({ _id: req.params.boardId }, {
                $addToSet: {
                    guestMembers: req.params.memberId,
                },
            })
            .then(board => {
                //Add the team to the user team list
                User.updateOne({ _id: req.params.memberId }, {
                    $addToSet: {
                        boards: req.params.boardId,
                    }
                })
                    .then()
                    .catch(err => res.status(404).json({ message: "This user does not exists - " + err }));
                res.status(201).send({ board: board, message: 'User successfully added to the board' })
            })
            .catch(err => res.status(404).json({ message: "This board does not exists - " + err }));

    };

    // @route DELETE api/board/admin/:teamId/delete/user/:memberId
    // @desc add a user to the team
    // @access Auth users

    const deleteMember = async (req, res) => {

        const board = Board.findById(req.params.boardId);
        const user = User.findById(req.params.memberId);

        if (!board) {
            return res.status(404).json({ teamName: "This board does not exists" });
        }
        if (!user) {
            return res.status(404).json({ teamName: "This user does not exists" });
        }

        board.updateOne({
            $pull: {
                guestMembers: req.params.memberId,
                admins: req.params.memberId,
            }
        })
            .then(team => {
                //Delete the team to the user team list
                User.updateOne({ _id: req.params.memberId }, {
                    $pull: {
                        boards: req.params.boardId
                    }
                })
                    .then()
                    .catch(err => res.status(404).json({ message: "This user does not exists - " + err }))
                res.status(201).send({ team: team, message: 'User successfully deleted from the board' })
            })
            .catch(err => console.log(err));

    };

    // @route PUT api/board/admin/:teamId/update/user/role/:memberId
    // @desc add a user to the team
    // @access Auth users

    const updateMemberRole = async (req, res) => {

        const board = Board.findById(req.params.boardId);
        const user = User.findById(req.params.memberId);

        if (!board) {
            return res.status(404).json({teamName: "This board does not exists"});
        }
        if (!user) {
            return res.status(404).json({teamName: "This user does not exists"});
        }

        if (req.body.isAdmin) {
            // add to admin collection
            await Board.updateOne({_id: req.params.boardId}, {$addToSet: {admins: req.params.memberId}})
                .catch(err => res.status(404).json({ message: "This Board does not exists - " + err }));
        } else {
            await Board.updateOne({_id: req.params.boardId}, {$pull: {admins: req.params.memberId}})
                .catch(err => res.status(404).json({ message: "This Board does not exists - " + err }));
        }

        res.status(201).send({message: 'User role successfully updated'});
    };


    // @route POST api/board/admin/:boardId/add/team/:teamId
    // @desc add a team to the board
    // @access Auth users

    const addTeam = async (req, res) => {

        const board = Board.findById(req.params.boardId);
        const team = Team.findById(req.params.teamId);

        if (!board) {
            return res.status(404).json({ teamName: "This board does not exists" });
        }
        if (!team) {
            return res.status(404).json({ teamName: "This team does not exists" });
        }

        Board
            .updateOne({ _id: req.params.boardId }, {
                $set: {
                    "team": req.params.teamId
                },
            })
            .then(board => {
                //Add the team to the user team list
                Team.updateOne({ _id: req.params.teamId }, {
                    $addToSet: {
                        boards: req.params.boardId,
                    }
                })
                    .then()
                    .catch(err => res.status(404).json({ message: "This team does not exists - " + err }));
                res.status(201).send({ board: board, message: 'Team successfully added to the board' })
            })
            .catch(err => res.status(404).json({ message: "This Board does not exists - " + err }));

    };

    const deleteTeam = async (req, res) => {

        const board = Board.findById(req.params.boardId);
        const team = Team.findById(req.params.teamId);

        if (!board) {
            return res.status(404).json({ teamName: "This board does not exists" });
        }
        if (!team) {
            return res.status(404).json({ teamName: "This team does not exists" });
        }


        Team.findById(req.params.teamId).then(teamFounded => {
            console.log(teamFounded);
            Board
                .updateOne({_id: req.params.boardId}, {
                    $unset: {
                        "team": ""
                    },
                    $pullAll: {
                        "admins": teamFounded.members
                    }
                })
                .then(board => {
                    //Add the team to the user team list
                    Team.updateOne({_id: req.params.teamId}, {
                        $pull: {
                            boards: req.params.boardId,
                        }
                    })
                        .then()
                        .catch(err => res.status(404).json({message: "This team does not exists - " + err}));
                    res.status(201).send({board: board, message: 'Team successfully removed from the board'})
                })
                .catch(err => res.status(404).json({message: "This Board does not exists - " + err}));
        })  .catch(err => res.status(404).json({message: "This Team does not exists - " + err}));

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
        addList,
        getLists,
        addLabel,
        addMember,
        deleteMember,
        updateMemberRole,
        addTeam,
        deleteTeam
    };
};

module.exports = BoardController;
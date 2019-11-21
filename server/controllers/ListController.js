const express = require("express");
const router = express.Router();
const cors = require("cors");
let debug = require('debug')('app:lists');

// Load models
let List = require('../models/List');
let Board = require('../models/Board');

// Load input validation
const validateCreateListInput = require("../validation/createList.js");
const validateIdParam = require("../validation/idParam");

router.use(cors());

const ListController = () => {

    /**
     * Create a list
     * @param {string} boardId.param.required - the board's id
     * @returns {List} 201 - List created
     */
    const createList = async (req, res) => {
        // Form validation
        const { errors, isValid } = validateCreateListInput(req.body);

        // Check validation
        if (!isValid) {
            return res.status(422).json({ message: "Invalid input" });
        }

        if (!req.body.boardId) {
            return res.status(422).json({ message: "Invalid board id" });
        }

        //Search if the board exists
        Board.findById(req.body.boardId)
            .then(board => {
                //If the board is not null
                if (board) {
                    //Create the new list
                    const newList = new List({
                        name: req.body.name
                    });
                    newList
                        .save()
                        .then(list => {
                            //Add the list to the lists array in the board
                            Board.updateOne({ _id: req.body.boardId }, {
                                $addToSet: {
                                    lists: list._id,
                                }
                            })
                                .then(board => res.status(201).send({ list: list, message: 'List successfully created' }))
                                .catch(err => res.status(404).json({ message: "Board not found - " + err }))
                        })
                        .catch(err => res.status(500).json({ message: "Server error - " + err }));
                } else {

                }
            })
            .catch(err => res.status(404).json({ message: "Board not found - " + err }))
    }

    /**
     * Get a list
     * @param {string} id.param.required - the list's id
     * @returns {List} 201 - List got
     */
    const getList = async (req, res) => {
        const id = req.params.id;

        // List Id validation
        const { errors, idIsValid } = validateIdParam(id);
        if (!idIsValid) {
            return res.status(422).json({ message: errors.name });
        }

        List.findOne({ _id: Object(id) }).then(list => {
            if (list) {
                return res.status(201).json({ list: list, message: "List found" })
            } else {
                return res.status(404).json({ message: "List not found" });
            }
        }).catch(err => {
            res.status(404).json({ message: "List not found - " + err });
        });
    }

    /**
     * Archive or unarchive a list
     * @param {string} id.param.required - the list's id
     * @param {boolean} isArchived.body.required - the value (true = close, false = open)
     * @returns {code} 201 - List updated
     */
    const archiveList = async (req, res) => {
        const id = req.params.id;
        // List Id validation
        const { errors, idIsValid } = validateIdParam(id);
        if (!idIsValid) {
            return res.status(422).json({ message: errors.name });
        }

        if (req.body.isArchived != false && req.body.isArchived != true) {
            return res.status(422).json({ message: "isArchived is invalid" });
        }

        //Search if the list exists
        List.findOne({ _id: req.params.id })
            .then(list => {
                //If the list exists
                if (list) {
                    // update the list archived status
                    List.update({ _id: req.params.id }, {
                        isArchived: req.body.isArchived
                    })
                        .then(list => {
                            List.findById(req.params.id)
                                .then(list => {
                                    res.status(201).send({ list: list, message: 'List archived status successfully updated' });
                                })
                                .catch(err => res.status(404).json({ message: "This list does not exists - " + err }));
                        })
                        .catch(err => res.status(404).json({ message: "This list does not exists - " + err }));
                } else {
                    return res.status(404).json({ message: "This list does not exists" })
                }
            })
            .catch(err => res.status(404).json({ message: "This list does not exists - " + err }))
    }

    /**
     * Rename a list
     * @param {string} id.param.required - the list's id
     * @param {string} name.body.required - the name value
     * @returns {code} 201 - List updated
     */
    const renameList = async (req, res) => {
        const id = req.params.id;

        // List Id validation
        if (!validateIdParam(id).idIsValid) {
            return res.status(422).json({ message: validateIdParam(id).errors.name });
        }

        // Form validation
        const { errors, isValid } = validateCreateListInput(req.body);

        // Check validation
        if (!isValid) {
            return res.status(422).json({ message: "Invalid input" });
        }

        //Search the list
        List.findOne({ _id: Object(id) })
            .then(list => {
                //If the list exists
                if (list) {
                    //Rename the list
                    List.updateOne(
                        { _id: Object(id) },
                        {
                            $set: {
                                "name": req.body.name,
                            }
                        },
                    )
                        .then(list => {
                            //Get the list to return
                            List.findOne({ _id: Object(id) })
                                .then(list => res.status(201).json({ list: list, message: "List renamed" }))
                                .catch(err => res.status(404).json({ message: "List not found - " + err }))
                        })
                        .catch(err => res.status(404).json({ message: "List not found - " + err }))
                } else {
                    return res.status(404).json({ message: "List not found" })
                }
            })
            .catch(err => res.status(404).json({ message: "List not found - " + err }));
    }

    /**
     * Change the position of a list
     * @param {string} id.param.required - the list's id
     * @param {number} value.query.required - the position value
     * @returns {code} 201 - List updated
     */
    const moveList = async (req, res) => {

    }

    return {
        createList,
        getList,
        archiveList,
        renameList,
        moveList
    };
};

module.exports = ListController;
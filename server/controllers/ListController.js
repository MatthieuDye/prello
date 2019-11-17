const express = require("express");
const router = express.Router();
const cors = require("cors");
let debug = require('debug')('app:lists');

// Load models
let List = require('../models/List');
let Board = require('../models/Board');

// Load input validation
const validateCreateListInput = require("../validation/createList.js");

router.use(cors());

const ListController = () => {

    /**
     * Create a list
     * @param {string} id.param.required - the board's id
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
            return res.status(422).json({ message: "Invalid input" });
        }

        //Serach if the board exists
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
     * @returns {List} 200 - List got
     */
    const getList = async (req, res) => {

    }

    /**
     * Archive or unarchive a list
     * @param {string} id.param.required - the list's id
     * @param {boolean} value.query.required - the value (true = close, false = open)
     * @returns {code} 201 - List updated
     */
    const archiveList = async (req, res) => {

    }

    /**
     * Rename a list
     * @param {string} id.param.required - the list's id
     * @param {string} value.query.required - the name value
     * @returns {code} 201 - List updated
     */
    const renameList = async (req, res) => {

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
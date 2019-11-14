const express = require("express");
const router = express.Router();
const cors = require("cors");

// Load models
const Board = require("../models/Board");
const Label = require('../models/Label');
const List = require('../models/List');

// Load input validation
const validateCreateBoardInput = require("../validation/createBoard.js");

router.use(cors());

const BoardController = () => {

    /**
     * Create a board
     * @route POST /boards
     * @group board - Operations about boards
     * @param board.body.required - board's information.
     * @returns {Board.model} 201 - Board created
     * @returns {Error}  400 - bad request, one of fields is invalid
     * @returns {Error}  401 - Unauthorized, invalid credentials
     * @returns {Error}  default - Unexpected error
     * @security JWT
     */
    const createBoard = async (req, res) => {
        // Form validation
        const { errors, isValid } = validateCreateBoardInput(req.body);

        // Check validation
        if (!isValid) {
            return res.status(422).json({message: "Invalid input"});
        }

        Board.findOne({ name: req.body.name }).then(board => {
            if (board) {
                return res.status(409).json({ boardName: "This board name already exists" });
            } else {
                const newBoard = new Board({
                    name: req.body.name,
                    description: req.body.description,
                    members: [{ idUser: req.body.userId, admin: true }],
                });
                newBoard
                    .save()
                    .then(board => res.status(201).send({ message: 'Board successfully created', board: board }))
                    .catch(err => res.status(500).json({message: "Server error " + err}));
            }
        });
    }

    /**
     * Get a board by id
     * @route GET /boards/{id}
     * @group board - Operations about boards
     * @param {string} id.path.required - board's id.
     * @returns {Board.model} 200 - Board object
     * @returns {Error}  401 - Unauthorized, invalid credentials
     * @returns {Error}  404 - Not found, board is not found
     * @returns {Error}  default - Unexpected error
     * @security JWT
     */
    const getBoard = async (req, res) => {

        const id = req.params.id
        
        Board.findOne({ _id: Object(id) }).then(board => {
            if(board){
                return res.status(400).json(board)
            }else{
                return res.status(404).json({ boardNotFound: "Board not found" });
            }
        }).catch(err => {
            res.status(404).json({ error: err });
          });
    }

    /**
     * Update a board by id
     * @route PUT /boards/{id}
     * @group board - Operations about boards
     * @param {string} id.path.required - board's id
     * @param {string} name.query - board's name.
     * @param {string} desc.query - board's description.
     * @param {string} closed.query - board's archived or not.
     * @returns {code} 200 - Board updated successfully
     * @returns {Error}  401 - Unauthorized, invalid credentials
     * @returns {Error}  404 - Not found, board is not found
     * @returns {Error}  default - Unexpected error
     */
    const updateBoard = async (req, res) => {
        /* let board = req.board;
 
         (req.query.name) ? board.name = req.query.name : null;
         (req.query.desc) ? board.desc = req.query.desc : null;
         (req.query.closed) ? board.closed = req.query.closed : null;
 
         board.validate(function (err) {
             if (err) return res.status(400).json({ message: err });
             board.save(function (err) {
                 if (err) {
                     debug('PUT board/:id error : ' + err);
                     return res.status(500).json({ message: 'Unexpected internal error' });
                 }
                 return res.status(200).json({ message: 'Board updated successfully' });
             });
         });*/
    }

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
        addLabel
    };
};

module.exports = BoardController;
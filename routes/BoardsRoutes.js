let express = require('express');
let router = express.Router();
let Board = require('./../models/Board');
let Label = require('./../models/Label');
let List = require('./../models/List');
let debug = require('debug')('app:board');
let boardAccess = require('./../middlewares/BoardMiddleware');

/**
 * Create a board
 * @route POST /boards
 * @group board - Operations about boards
 * @param {NewBoard.model} board.body.required - board's information.
 * @returns {Board.model} 201 - Board created
 * @returns {Error}  400 - bad request, one of fields is invalid
 * @returns {Error}  401 - Unauthorized, invalid credentials
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/', function(req, res) {

    let newBoard = new Board(req.body);

    newBoard.createOrUpdateMember(req.user._id, "admin", true);

    newBoard.validate(function (err) {
        if (err) return res.status(400).json({message : err});
        newBoard.save(function (err) {
            if (err) {
                debug('POST boards/ error : ' + err);
                return res.status(400).json({message : err});
            }
        });
    });
});

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
router.get('/:id', function(req, res) {

    req.query._id = req.params.id;

    Board.findById(req.query)
        .populate('memberships.idMember', '_id username firstName lastName')
        .populate('labels')
        .exec(function (err, board) {
            if (err) debug('GET boards/:id error : ' + err);
            if (!board) return res.status(404).json({message: 'Board not found'});
            return res.status(200).json(board);
        }).then() ;
});

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
 * @security JWT
 */
router.put('/:id', function(req, res) {

    let board = req.board;

    (req.query.name) ? board.name = req.query.name : null;
    (req.query.desc) ? board.desc = req.query.desc : null;
    (req.query.closed) ? board.closed = req.query.closed : null;

    board.validate(function (err) {
        if(err) return res.status(400).json({message:err});
        board.save(function (err) {
            if(err) {
                debug('PUT board/:id error : ' + err);
                return res.status(500).json({message:'Unexpected internal error'});
            }
            return res.status(200).json({message:'Board updated successfully'});
        });
    });
});

/**
 * Create a list on the board
 * @route POST /boards/{id}/lists
 * @group board - Operations about boards
 * @param {string} id.path.required - board's id.
 * @param {ListNew.model} list.body.required - list's information
 * @returns {List.model} 200 - List object
 * @returns {Error}  401 - Unauthorized, invalid credentials
 * @returns {Error}  404 - Not found, board is not found
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/:id/lists', function(req, res) {

    req.body.idBoard = req.params.id;

    Board.findById(req.params.id)
        .exec(function (err, board) {
            if (err) debug('POST boards/:id/lists error : ' + err);
            if (!board)
                return res.status(404).json({message: 'Board not found'});

            let newList = new List(req.body);
            newList.validate(function (err) {
                if (err) return res.status(400).json({message: err});

                newList.save(function (err) {
                    if (err) {
                        debug('POST boards/:id/lists error : ' + err);
                        return res.status(500).json({message: 'Unexpected internal error'});
                    }
                    res.status(201).json(newList);
                });
            });
        }).then();
});


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
router.get('/:id/lists',function(req, res) {
    req.query.idBoard = req.board._id;
    let openCard = false;
    if(req.query.cards){
        if(req.query.cards === 'open') openCard = true;
        delete req.query.cards;
    }
    let query = List.find(req.query);
    if(openCard) query.populate('cards');
    query.exec(function (err, lists) {
        if (err) {
            debug('GET boards/:id/lists error : ' + err)
            return res.status(500).json({message: 'Unexpected internal error'});
        }
        return res.status(200).json(lists)
    }).then( );
});

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
router.post('/:id/labels', function(req, res) {

    if(!req.query.name) return res.status(400).json({message: 'Label name missing'});
    if(!req.query.color) return res.status(400).json({message: 'Label color missing'});

    let label = new Label({name : req.query.name, color : req.query.color, idBoard : req.board._id});

    label.validate(function(err){
        if(err) return res.status(400).json({message: err});
        label.save(function(err){
            if(err) return res.status(500).json({message:'Unexpected internal error.'});
            return res.status(201).json(label);
        })
    })

});

module.exports = router;

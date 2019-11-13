const express = require("express");
const router = express.Router();
const cors = require("cors");

let debug = require('debug')('app:card');
let CardAccess = require('../middlewares/CardMiddleware');
let mongoose = require('mongoose');

// Load models
const Card = require("../models/Card");
let Label = require('../models/Label');

router.use(cors());

const CardController = () => {

    /**
     * Create a card
     * @route POST /cards
     * @group card - Operations about cards
     * @param {Card.model} card.body.required - card's information.
     * @returns {Card.model} 201 - Card created
     * @returns {Error}  400 - bad request, one of fields is invalid
     * @returns {Error}  401 - Unauthorized, invalid credentials
     * @returns {Error}  403 - Invalid rights
     * @returns {Error}  default - Unexpected error
     * @security JWT
     */
    const createCard = async (req, res) => {
        let newCard = new Card(req.body);

        newCard.validate(function (err) {
            if (err) return res.status(400).json({ message: err });
            newCard.save(function (err) {
                if (err) {
                    debug('POST cards error : ' + err);
                    return res.status(500).json({ message: 'Unexpected internal error' });
                }
                return res.status(201).json(newCard);
            });
        });
    }

    /**
     * Get a card by id
     * @route GET /cards/:id
     * @group card - Operations about cards
     * @param {string} id.path.required - card's id
     * @param {string} checklists.query - card's checklist (value on "open" to display)
     * @returns {Card.model} 200 - Card
     * @returns {Error}  400 - bad request, one of fields is invalid
     * @returns {Error}  401 - Unauthorized, invalid credentials
     * @returns {Error}  403 - Forbidden, invalid rights
     * @returns {Error}  default - Unexpected error
     * @security JWT
     */
    const getCard = async (req, res) => {
        let openChecklist = false;
        let openComment = false;
        if (req.query.checklist) {
            if (req.query.checklist === 'open') openChecklist = true;
            delete req.query.checklist;
        }

        if (req.query.comments) {
            if (req.query.comments === 'open') openComment = true;
            delete req.query.comments;
        }

        req.query._id = req.params.id

        let query = Card.findOne(req.query);
        query.populate('idLabels');
        if (openChecklist) {
            query.populate(
                {
                    path: 'checklists',
                    populate: { path: 'checkItems' }
                });
        }
        if (openComment) {
            query.populate(
                {
                    path: 'comments',
                    populate: {
                        path: 'idAuthor',
                        select: 'username'
                    }
                });
        }
        query.exec(function (err, card) {
            if (err) debug('GET cards/:id error : ' + err);
            if (!card) return res.status(404).json({ message: 'Card not found' });

        });
    }

    /**
     * Delete a card by id
     * @route Delete /cards/:id
     * @group card - Operations about cards
     * @param {string} id.path.required - card's id
     * @returns {Card.model} 200 - Card deleted
     * @returns {Error}  401 - Unauthorized, invalid credentials
     * @returns {Error}  403 - Forbidden, invalid rights
     * @returns {Error}  default - Unexpected error
     * @security JWT
     */
    const deleteCard = async (req, res) => {
        req.card.remove();
        req.card.save((err) => {
            if (err) return res.status(500).json({ message: 'Unexpected internal error' })
            return res.status(200).json({ message: 'Card successfully deleted' })
        });
    }

    /**
     * Update a card
     * @route PUT /cards/:id
     * @group card - Operations about cards
     * @param {string} id.path.required - card's id
     * @param {string} name.query - card's name
     * @param {string} desc.query - card's description
     * @param {boolean} closed.query - card's closed state
     * @param {string} due.query - card's due date
     * @param {date} dueComplete.query - card's due date completed
     * @param {number} pos.query - card's position
     * @param {string} idList.query - card's list attached
     * @returns {code} 200 - Card updated
     * @returns {Error}  400 - bad request, one of fields is invalid
     * @returns {Error}  401 - Unauthorized, invalid credentials
     * @returns {Error}  403 - Forbidden, member has not rights access
     * @returns {Error}  default - Unexpected error
     * @security JWT
     */
    const updateCard = async (req, res) => {
        let card = req.card;

        (req.query.name) ? card.name = req.query.name : null;
        (req.query.desc) ? card.desc = req.query.desc : null;
        (req.query.closed) ? card.closed = req.query.closed : null;
        (req.query.due) ? ((req.query.due !== 'null') ? card.due = req.query.due : card.due = undefined) : null;
        (req.query.dueComplete) ? card.dueComplete = req.query.dueComplete : null;
        (req.query.pos) ? card.pos = req.query.pos : null;
        (req.query.idList) ? card.idList = req.query.idList : null;

        card.validate(function (err) {
            if (err) return res.status(400).json({ message: err });
            card.save(function (err) {
                if (err) {
                    debug('PUT cards/:id error : ' + err);
                    return res.status(500).json({ message: 'Unexpected internal error' });
                }
                return res.status(200).json({ message: 'Card updated successfully' });
            });
        });
    }

    /**
     * Add a label to the card
     * @route POST /cards/{id}/idLabels
     * @group card - Operations about cards
     * @param {string} id.path.required - card's id.
     * @param {string} value.query.required - label's id value to add.
     * @returns {Code} 200 - Label added
     * @returns {Error}  400 - Bad request, label already added
     * @returns {Error}  401 - Unauthorized, invalid credentials
     * @returns {Error}  403 - Forbidden, invalid credentials
     * @returns {Error}  404 - Not found, card or label is not found
     * @returns {Error}  default - Unexpected error
     * @security JWT
     */
    const addLabel = async (req, res) => {
        Label.findById(req.query.value, function (err, label) {
            if (err) debug('card/:id/idLabels error : ' + err);
            if (!label) return res.status(404).json({ message: 'Label not found' });
            if (!label.idBoard.equals(req.card.idBoard)) return res.status(400).json({ message: 'Bad request, provide a label associate with the same board' });
            debug(label._id)
            req.card.idLabels.push(label._id);
            req.card.validate(function (err) {
                if (err) return res.status(400).json({ message: err });
                req.card.save(function (err) {
                    if (err) return res.status(500).json({ message: 'Unexpected internal error' });
                    return res.status(201).json({ message: 'Label added successfully' });
                });
            });
        });
    }

    /**
     * Remove a label from a card
     * @route DELETE /cards/{id}/idLabels/{idLabel}
     * @group board - Operations about boards
     * @param {string} id.path.required - card's id.
     * @param {string} idLabel.path.required - label's id to remove.
     * @returns {Code} 200 - Label removed
     * @returns {Error}  401 - Unauthorized, invalid credentials
     * @returns {Error}  403 - Forbidden, invalid credentials
     * @returns {Error}  404 - Not found, card is not found
     * @returns {Error}  default - Unexpected error
     * @security JWT
     */
    const deleteLabel = async (req, res) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.idLabel))
            return res.status(404).json({ message: 'Label id wrong' });

        req.card.idLabels.remove(req.params.idLabel);
        req.card.save(function (err) {
            if (err) return res.status(400).json({ message: err });
            return res.status(200).json({ message: 'Label removed successfully' });
        })
    }

    return {
        createCard,
        getCard,
        deleteCard,
        updateCard,
        addLabel,
        deleteLabel
    };
};

module.exports = CardController;
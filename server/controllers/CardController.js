const express = require("express");
const router = express.Router();
const cors = require("cors");

let debug = require('debug')('app:card');
let mongoose = require('mongoose');

// Load models
const Card = require("../models/Card");
const List = require("../models/List");
let Label = require('../models/Label');

// Load input validation
const validateCreateCardInput = require("../validation/createCard.js");
const validateIdParam = require("../validation/idParam");

router.use(cors());

const CardController = () => {

    /**
     * Create a card
     * @param {Card.model} card.body.required - card's information.
     * @param {string} listId.body.required - the list's id
     * @returns {Card.model} 201 - Card created
     */
    const createCard = async (req, res) => {
        const { listId, name } = req.body

        // Form validation
        const { errors, isValid } = validateCreateCardInput(req.body);

        // Check validation
        if (!isValid) {
            return res.status(422).json({ message: errors });
        }

        // List Id validation
        if (!listId) {
            return res.status(422).json({ message: "Invalid team id" });
        }

        //Search if the list exists
        List.findById(listId)
            .then(existingList => {
                //If the list is not null
                if (existingList) {
                    //Create the new card
                    const newCard = new Card({
                        name: name
                    });
                    newCard
                        .save()
                        .then(createdCard => {
                            //Add the card to the cards array in the list
                            List.updateOne({ _id: listId }, {
                                $addToSet: {
                                    cards: createdCard._id,
                                }
                            })
                                .then(listWithCard => res.status(201).send({ card: createdCard, message: 'Card successfully created' }))
                                .catch(err => res.status(404).json({ message: "List not found - " + err }))
                        })
                        .catch(err => res.status(500).json({ message: "Server error - " + err }));
                } else {

                }
            })
            .catch(err => res.status(404).json({ message: "List not found - " + err }))
    }

    /**
     * Get a card
     * @param {string} id.param.required - the card's id
     * @returns {Card.model} 201 - Card got
     */
    const getCard = async (req, res) => {
        const id = req.params.id;

        // Card Id validation
        const { errors, idIsValid } = validateIdParam(id);
        if (!idIsValid) {
            return res.status(422).json({ message: errors.name });
        }

        Card.findOne({ _id: Object(id) }).then(card => {
            if (card) {
                return res.status(201).json({ card: card, message: "Card found" })
            } else {
                return res.status(404).json({ message: "Card not found" });
            }
        }).catch(err => {
            res.status(404).json({ message: "Card not found - " + err });
        });
    }

    /**
     * Delete a card by id
     * @param {string} id.path.required - card's id
     * @returns {Card.model} 201 - Card deleted
     */
    const deleteCard = async (req, res) => {
       /* req.card.remove();
        req.card.save((err) => {
            if (err) return res.status(500).json({ message: 'Unexpected internal error' })
            return res.status(200).json({ message: 'Card successfully deleted' })
        });*/
    }

    /**
     * Update a card
     * @param {string} id.path.required - card's id
     * @param {string} name.query - card's name
     * @param {string} desc.query - card's description
     * @param {boolean} closed.query - card's closed state
     * @param {string} due.query - card's due date
     * @param {date} dueComplete.query - card's due date completed
     * @param {number} pos.query - card's position
     * @param {string} idList.query - card's list attached
     */
    const updateCard = async (req, res) => {
       
    }

    /**
     * Add a label to the card
     * @param {string} id.path.required - card's id.
     * @param {string} value.query.required - label's id value to add.
     * @returns {Code} 201 - Label added
     */
    const addLabel = async (req, res) => {
       
    }

    /**
     * Remove a label from a card
     * @param {string} id.path.required - card's id.
     * @param {string} idLabel.path.required - label's id to remove.
     * @returns {Code} 201 - Label removed
     */
    const deleteLabel = async (req, res) => {
       
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
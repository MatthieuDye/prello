const express = require("express");
const router = express.Router();
const cors = require("cors");

let debug = require('debug')('app:card');
let mongoose = require('mongoose');

// Load models
const Card = require("../models/Card");
let Label = require('../models/Label');

router.use(cors());

const CardController = () => {

    /**
     * Create a card
     * @param {Card.model} card.body.required - card's information.
     * @returns {Card.model} 201 - Card created
     */
    const createCard = async (req, res) => {
        
    }

    /**
     * Get a card by id
     * @param {string} id.path.required - card's id
     * @param {string} checklists.query - card's checklist (value on "open" to display)
     * @returns {Card.model} 201 - Card
     */
    const getCard = async (req, res) => {
        
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
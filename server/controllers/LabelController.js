const express = require("express");
const router = express.Router();
const cors = require("cors");

// Load models
let Label = require('../models/Label');

router.use(cors());

const LabelController = () => {

    /**
     * Get a label
     * @param {string} id.path.required - label's id.
     * @returns {Label.model} 201 - Label
     */
    const getLabel = async (req, res) => {
        
    }

    /**
     * Update a label
     * @param {string} id.path.required - label's id.
     * @param {string} name.query - label's name to update.
     * @param {string} color.query - label's color to update.
     * @returns {Label.model} 201 - Label updated
     */
    const updateLabel = async (req, res) => {
        
    }

    /**
     * Remove a label
     * @param {string} id.path.required - label's id.
     * @returns {code} 201 - Label removed
     */
    const deleteLabel = async (req, res) => {
       
    }

    return {
        getLabel,
        updateLabel,
        deleteLabel
    };
};

module.exports = LabelController;
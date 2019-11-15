const express = require("express");
const router = express.Router();
const cors = require("cors");
let debug = require('debug')('app:lists');

// Load models
let List = require('../models/List');

router.use(cors());

const ListController = () => {

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
        getList,
        archiveList,
        renameList,
        moveList
    };
};

module.exports = ListController;
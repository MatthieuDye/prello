let express = require('express');
let router = express.Router();
let Label = require('./../models/Label');
let debug = require('debug')('app:labels');
let LabelAccess = require('./../middlewares/LabelMiddleware');

/**
 * Get a label
 * @route GET /labels/{id}
 * @group label - Operations about labels
 * @param {string} id.path.required - label's id.
 * @returns {Label.model} 200 - Label
 * @returns {Error}  400 - bad request, one of fields is invalid
 * @returns {Error}  401 - Unauthorized, invalid credentials
 * @returns {Error}  403 - Invalid rights
 * @returns {Error}  404 - Label not found
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/:id', LabelAccess.readRights(), function(req, res) {
    return res.status(200).json(req.label);
});

/**
 * Update a label
 * @route PUT /labels/{id}
 * @group label - Operations about labels
 * @param {string} id.path.required - label's id.
 * @param {string} name.query - label's name to update.
 * @param {string} color.query - label's color to update.
 * @returns {Label.model} 200 - Label updated
 * @returns {Error}  400 - bad request, one of fields is invalid
 * @returns {Error}  401 - Unauthorized, invalid credentials
 * @returns {Error}  403 - Invalid rights
 * @returns {Error}  404 - Label not found
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.put('/:id', LabelAccess.updateRights(), function(req, res) {

    req.query.name ? req.label.name = req.query.name : null;
    req.query.color ? req.label.color = req.query.color : null;

    req.label.validate((err) => {
        if(err) return res.status(400).json({message : err});
        req.label.save( (err) => {
            if(err) return res.status(500).json({message : 'Unexpected internal error'});
            return res.status(200).json(req.label);
        });
    });
});

/**
 * Remove a label
 * @route DELETE /labels/{id}
 * @group label - Operations about labels
 * @param {string} id.path.required - label's id.
 * @returns {code} 200 - Label removed
 * @returns {Error}  401 - Unauthorized, invalid credentials
 * @returns {Error}  403 - Invalid rights
 * @returns {Error}  404 - Label not found
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.delete('/:id', LabelAccess.updateRights(), function(req, res) {

    req.label.remove();
    req.label.save((err) => {
        if(err) return res.status(500).json({message : 'Unexpected internal error'});
        return res.status(200).json({message : 'Label successfully removed'});
    })
});

module.exports = router;
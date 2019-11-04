let Label = require('../models/Label');
let debug = require('debug')('app:listAccess');

let findLabelAndBoard = function(req, res, next) {
    Label.findById(req.params.id)
        .populate('idBoard', 'memberships')
        .exec(function (err, label) {
            if (err) debug(err)
            if (!label) return res.status(404).json({message:'Label not found'});
            if (!label.idBoard) return res.status(500).json({message:'Associate board not found'});
            req.label = label;
            next();
        });
};

let updateRights = function() {
    return function (req, res, next) {
        findLabelAndBoard(req, res, function () {
            let board = req.label.idBoard;
            let member = req.user.id;
            if (!board.isNormalMember(member) && !board.isAdminMember(member)) return res.status(403).json({message:'Forbidden access'});
            req.user.access = true;
            return next();
        });
    }
};

let readRights = function() {
    return function (req, res, next) {
        findLabelAndBoard(req, res, function () {
            let board = req.label.idBoard;
            let member = req.user.id;
            if (!board.getMember(member)) return res.status(403).json({message:'Forbidden access'});
            req.user.access = true;
            return next();
        });
    }
};

module.exports = LabelAccess = {
    updateRights : updateRights,
    readRights : readRights
};
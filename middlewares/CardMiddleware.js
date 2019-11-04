let Card = require('../models/Card');
let List = require('../models/List');
let debug = require('debug')('app:listAccess');

let findList = function(req, res, next) {

    if(!req.body.idList)
        return res.status(400).json({message:'List id missing'});

    List.findById(req.body.idList)
        .populate('idBoard')
        .exec(function (err, list) {
            if (err) debug(err);
            if (!list) return res.status(400).json({message:'Associate list not found'});
            if (!list.idBoard) return res.status(500).json({message:'Unexpected internal error'});
            req.list = list;
            return next();
        });
};

let findCard = function(req, res, next) {
    if(!req.params.id)
        return res.status(400).json({messaage:'Card id missing'});
    Card.findById(req.params.id)
        .populate({
            path: 'idList',
            populate: {path: 'idBoard'}
        })
        .exec(function (err, card) {
            if (err) debug(err);
            if (!card) return res.status(404).json({message:'Card not found'});
            if (!card.idList) return res.status(400).json({message:'Associate list not found'});
            if (!card.idList.idBoard) return res.status(500).json({message:'Unexpected internal error'});
            req.card = card;
            return next();
        });
};

let createRights = function() {
    return function (req, res, next) {
        findList(req, res, function () {
            let board = req.list.idBoard;
            let member = req.user.id;
            if (!board.isNormalMember(member) && !board.isAdminMember(member))
                return res.status(403).json({message:'Forbidden access'});
            req.user.access = true;
            return next();
        });
    }
};

let readRights = function() {
    return function (req, res, next) {
        findCard(req, res, function () {
            let board = req.card.idList.idBoard;
            let member = req.user.id;
            if (!board.getMember(member)) return res.status(403).json({message:'Forbidden access'});
            req.user.access = true;
            return next();
        });
    }
};

let updateRights = function() {
    return function (req, res, next) {
        findCard(req, res, function () {
            let board = req.card.idList.idBoard;
            let member = req.user.id;
            if (!board.isNormalMember(member) && !board.isAdminMember(member))
                return res.status(403).json({message:'Forbidden access'})
            req.user.access = true;
            return next();
        });
    }
};

module.exports = ListAccess = {
    createRights : createRights,
    updateRights : updateRights,
    readRights : readRights
};
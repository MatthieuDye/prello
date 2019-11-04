let Board = require('../models/Board');
let List = require('../models/List');
let debug = require('debug')('app:listAccess');

let findBoard = function(req, res, next) {
    Board.findOne({'_id': req.params.id}, {'memberships': 1}, (err, board) => {
        if (err) debug(err);
        if (!board) return res.status(404).send('Not found.');
        req.board = board;
        return next();
    });
};

let updateRights = function() {
    return function (req, res, next) {
        findBoard(req, res, function () {
            let board = req.board;
            let member = req.user.id;
            if (!board.isNormalMember(member) && !board.isAdminMember(member)) return res.status(403).send('Forbidden.');
            req.user.access = true;
            return next();
        });
    }
};


let deleteRights = function() {
    return function (req, res, next) {
        findBoard(req, res, function () {
            let board = req.board;
            let member = req.user.id;
            if (!board.isAdminMember(member)) return res.status(403).send('Forbidden.');
            req.user.access = true;
            return next();
        });
    }
};

let readRights = function() {
    return function (req, res, next) {
        findBoard(req, res, function () {
            let board = req.board;
            let member = req.user.id;
            if (!board.getMember(member)) return res.status(403).send('Forbidden.');
            req.user.access = true;
            return next();
        });
    }
};

module.exports = ListAccess = {
    updateRights : updateRights,
    readRights : readRights,
    deleteRights: deleteRights
};
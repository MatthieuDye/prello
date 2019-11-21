const Board = require("../../models/Board");
const decode = require("./helper");
module.exports = (req, res, next) => {


    const user = decode.decodeToken(req);
    const userId = user.id;
    const boardId = req.header("boardid");

    if (boardId === undefined) {
        return res.status(412).json({message: "Invalid Header"});
    } else {


        Board
            .findOne({_id: boardId})
            .then(board => {
                if (board) {
                    if (!board.admins.includes(userId)) {
                        return res.status(403).json({message: "Not a board admin"});
                    } else {
                        next()
                    }
                } else {
                    next()
                }
            })
            .catch(err => {
                next()
            })
    }
};
const Board = require("../../models/Board");
const decode = require("./helper");
module.exports = (req, res, next) => {


    const user = decode.decodeToken(req);
    const userId = user._id;
    const boardId = req.header("boardid");

    if (boardId === undefined) {
        return res.status(412).json({message: "Invalid Header"});
    } else {

        Board
            .findOne({_id: boardId})
            .populate([{
                path: 'team',
                select: ['members']
            }])
            .then(board => {
                if (board) {
                    if (!board.guestMembers.includes(userId)) {
                        if (board.team) {
                            if(!board.team.members.includes(userId)) {
                                return res.status(403).json({message: "Not a board member "});
                            } else {
                                next()
                            }
                        }else {
                            return res.status(403).json({message: "Not a board member "});
                        }
                    } else {
                        next()
                    }
                } else {
                    next()
                }
            })
            .catch(err => {next()})
    }
};
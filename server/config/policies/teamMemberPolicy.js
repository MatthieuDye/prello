const Team = require("../../models/Team");
const decode = require("./helper");
module.exports = (req, res, next) => {


    const user = decode.decodeToken(req);
    const userId = user._id;
    const teamId = req.header("teamid");

    if (teamId === undefined) {
        return res.status(412).json({message: "Invalid Header"});
    } else {

    Team
        .findOne({_id: teamId})
            .then(team => {
                if (team) {
                    if (!team.members.includes(userId)) {
                        return res.status(403).json({message: "Not a team member - "});
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
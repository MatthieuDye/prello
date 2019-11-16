const express = require("express");
const router = express.Router();
const cors = require("cors");

// Load input validation
const validateCreateTeamInput = require("../validation/createTeam");


// Load Team model
const Team = require("../models/Team");
const User = require("../models/User");

const UserController = require("../controllers/UserController");

router.use(cors());

const TeamController = () => {

    // @route POST api/team/creation
    // @desc Create the team
    // @access Auth users
    const createTeam = async (req, res) => {

        // Form validation
        const { errors, isValid } = validateCreateTeamInput(req.body);

        // Check validation
        if (!isValid) {
            return res.status(422).json({ message: "Invalid input" });
        }

        Team.findOne({ name: req.body.name }).then(team => {
            if (team) {
                return res.status(409).json({ message: "This team Name already exists" });
            } else {
                const newTeam = new Team({
                    name: req.body.name,
                    description: req.body.description,
                    members: [{ idUser: req.body.userId, isAdmin: true }],
                });
                newTeam
                    .save()
                    .then(team => {
                        //Add the team to the user team list
                        Team.findById(team.id)
                            .then(
                                User.findById(req.body.userId)
                                    .then(
                                        User.updateOne({ _id: req.body.userId }, {
                                            $addToSet: {
                                                teams: team.id,
                                            }
                                        })
                                            .then()
                                            .catch(err => res.send({ message: err }))
                                    )
                                    .catch(err => res.status(404).json({ message: "This user does not exists " + err }))
                            )
                            .catch(err => res.status(404).json({ message: "This team does not exists " + err }));
                        res.status(201).send({ message: 'Team successfully created', team: team })
                    })


                    .catch(err => res.status(500).json({ message: "Server error " + err }));
            }
        });
    };

    /**
     * Get a team by id
     * @param {string} id.path.required - team's id.
     * @returns {Team.model} 201 - Team object
     */
    const getTeam = async (req, res) => {

        const id = req.params.id

        Team.findOne({ _id: Object(id) }).then(team => {
            if (team) {
                return res.status(201).json(team)
            } else {
                return res.status(404).json({ message: "Team not found" });
            }
        }).catch(err => {
            res.status(404).json({ message: "Team not found " + err });
        });
    }

    // @route PUT api/team/addmember/:teamId/:memberId
    // @desc add a user to the team
    // @access Auth users
    const addMember = async (req, res) => {

        //TODO : if user in not a admin of the team : 403

        //Search if the team exists
        Team.findById(req.params.teamId)
            .then(team => {
                if (team) {
                    //Search if the user exists
                    User.findById(req.params.memberId)
                        .then(user => {
                            if (user) {
                                //Add the user to the team
                                Team
                                    .updateOne({ _id: req.params.teamId }, {
                                        $addToSet: {
                                            members: {
                                                idUser: req.params.memberId,
                                                isAdmin: req.body.isAdmin
                                            }
                                        }
                                    })
                                    .then(team => {
                                        //Add the team to the user team list
                                        User.findById(req.params.memberId).then(u => console.log(u))
                                        User.updateOne({ _id: req.params.memberId }, {
                                            $addToSet: {
                                                teams: req.params.teamId,
                                            }
                                        })
                                            .then()
                                            .catch(err => res.status(404).json({ message: "This user does not exists - " + err }))
                                        res.status(201).send({ team: team, message: 'User successfully added to the team' })
                                    })
                                    .catch(err => res.status(404).json({ message: "This team does not exists - " + err }));
                            } else {
                                return res.status(404).json({ message: "This user does not exists" })
                            }
                        })
                        .catch(err => res.status(500).json({ message: "Server error - " + err }))
                } else {
                    return res.status(404).json({ message: "This team does not exists" });
                }
            })
            .catch(err => res.status(500).json({ message: "Server error - " + err }))
    };

    const deleteMember = async (req, res) => {

        //TODO : if user in not a admin of the team : 403

        //Search if the team exists
        Team.findById(req.params.teamId)
            .then(team => {
                if (team) {
                    //Search if the user exists
                    User.findById(req.params.memberId)
                        .then(user => {
                            if (user) {
                                //Delete the user from the team
                                Team.update({ _id: req.params.teamId }, {
                                    $pull: {
                                        members: {
                                            idUser: req.params.memberId,
                                        }
                                    }
                                }, {
                                    multi: true
                                })
                                    .then(team => {
                                        //Delete the team to the user team list
                                        User.updateOne({ _id: req.params.memberId }, {
                                            $pull: {
                                                teams: req.params.teamId,
                                            }
                                        })
                                            .then()
                                            .catch(err => res.status(404).json({ message: "This user does not exists - " + err }))
                                        res.status(201).send({ team: team, message: 'User successfully deleted from the team' })
                                    })
                                    .catch(err => console.log(err));
                            } else {
                                return res.status(404).json({ message: "This user does not exists" })
                            }
                        })
                        .catch(err => res.status(500).json({ message: "Server error - " + err }))
                } else {
                    return res.status(404).json({ message: "This team does not exists" });
                }
            })
            .catch(err => res.status(500).json({ message: "Server error - " + err }))
    };

    const deleteTeam = async (req, res) => {

        //TODO : if user in not a admin of the team : 403

        //Search if the team exists
        Team.findById(req.params.teamId)
            .then(team => {
                if (team) {
                    //Delete the team
                    Team
                        .deleteOne({ _id: req.params.teamId })
                        .then(team => {
                            //Delete the team to the user team list
                            User.update({}, {
                                $pull: {
                                    teams: req.params.teamId,
                                }
                            }, {
                                multi: true
                            })
                                .then()
                                .catch(err => res.status(404).json({ team: team, message: "This user does not exists - " + err }))
                            res.status(201).send({ message: 'Team successfully deleted' })
                        })
                        .catch(err => console.log(err));
                } else {
                    return res.status(404).json({ message: "This team does not exists" })
                }
            })
            .catch(err => res.status(500).json({ message: "Server error - " + err }))
    };

    return {
        createTeam,
        getTeam,
        addMember,
        deleteMember,
        deleteTeam
    };
};

module.exports = TeamController;
const express = require("express");
const router = express.Router();
const cors = require("cors");

// Load input validation
const validateCreateTeamInput = require("../validation/createTeam");
const validateIdParam = require("../validation/idParam");

// Load models
const Team = require("../models/Team");
const User = require("../models/User");
const Board = require("../models/Board");

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

        if (!req.body.userId) {
            return res.status(422).json({ message: "No userId found for team creation" });
        }

        Team.findOne({ name: req.body.name }).then(team => {
            if (team) {
                return res.status(409).json({ message: "This team Name already exists" });
            } else {
                const newTeam = new Team({
                    name: req.body.name,
                    description: req.body.description,
                    members: [req.body.userId],
                    admins: [req.body.userId],
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
        const id = req.params.id;

        // Team Id validation
        const { errors, idIsValid } = validateIdParam(id);
        if (!idIsValid) {
            return res.status(422).json({ message: errors.name });
        }

        Team.findOne({ _id: Object(id) }).then(team => {
            if (team) {
                return res.status(201).json({ team: team, message: "Team found" })
            } else {
                return res.status(404).json({ message: "Team not found" });
            }
        }).catch(err => {
            res.status(404).json({ message: "Team not found " + err });
        });
    };

    /**
     * Update a team
     * @param {string} id.path.required - team's id.
     * @returns {Team.model} 201 - Team object
     */
    const updateTeam = async (req, res) => {
        const id = req.params.id;

        // Team Id validation
        if (!validateIdParam(id).idIsValid) {
            return res.status(422).json({ message: validateIdParam(id).errors.name });
        }

        // Form validation
        const { errors, isValid } = validateCreateTeamInput(req.body);

        // Check validation
        if (!isValid) {
            return res.status(422).json({ message: "Invalid input" });
        }

        //Search another team with the same name
        Team.findOne({ name: req.body.name, _id: { $ne: Object(id) } })
            .then(team => {
                if (team) {
                    return res.status(409).json({ message: "Team name already exists" });
                } else {
                    //Search the team
                    Team.findOne({ _id: Object(id) })
                        .then(team => {
                            //If the team exists
                            if (team) {
                                //Rename the list
                                Team.updateOne(
                                    { _id: Object(id) },
                                    {
                                        $set: {
                                            "name": req.body.name,
                                            "description": req.body.description
                                        }
                                    },
                                )
                                    .then(team => {
                                        //Get the team to return
                                        Team.findOne({ _id: Object(id) })
                                            .then(team => res.status(201).json({ team: team, message: "Team renamed" }))
                                            .catch(err => res.status(404).json({ message: "Team not found - " + err }))
                                    })
                                    .catch(err => res.status(404).json({ message: "Team not found - " + err }))
                            } else {
                                return res.status(404).json({ message: "Team not found" })
                            }
                        })
                        .catch(err => res.status(404).json({ message: "Team not found - " + err }))
                }
            })
            .catch(err => res.status(404).json({ message: "Team not found - " + err }));
    };

    const getTeamsByUserId = async (req, res) => {
        const userId = req.params.userId;

        // User Id validation
        const { errors, idIsValid } = validateIdParam(userId);
        if (!idIsValid) {
            return res.status(422).json({ message: errors.name });
        }

        User.findById(userId)
            .select('teams')
            .populate({
                path: 'teams',
                select: ['name', 'description', 'members']
            })
            .then(user => res.status(201).send({ teams: user.teams, message: 'Teams successfully fetched' }))
            .catch(err => {
                return res.status(404).json({ message: "This user does not exists" });
            })

    };


    // @desc add a user to the team
    // @access Auth users
    const addMember = async (req, res) => {
        const { teamId, memberUserName } = req.params;

        // Team Id validation
        const { errors, idIsValid } = validateIdParam(teamId);
        if (!idIsValid) {
            return res.status(422).json({ message: errors.name });
        }

        //Search if the team exists
        Team.findById(teamId)
            .then(team => {
                if (team) {
                    //Search if the user exists
                    User.findOne({ userName: memberUserName })
                        .then(user => {
                            if (user) {
                                //Add the user to the team
                                Team
                                    .updateOne({ _id: teamId }, {
                                        $addToSet: {
                                            members: user._id
                                        }
                                    })
                                    .then(team => {
                                        //Add the team to the user team list
                                        User.updateOne({ _id: user._id }, {
                                            $addToSet: {
                                                teams: teamId,
                                            }
                                        })
                                            .then(team => {
                                                //Get the team to return
                                                Team.findById(teamId)
                                                    .then(team => {
                                                        res.status(201).send({ team: team, message: 'User successfully added to the team' })

                                                    })
                                                    .catch(err => res.status(404).json({ message: "This team does not exists - " + err }));
                                            })
                                            .catch(err => res.status(404).json({ message: "This user does not exists - " + err }))
                                    })
                                    .catch(err => res.status(404).json({ message: "This team does not exists - " + err }));
                            } else {
                                return res.status(404).json({ message: "This user does not exists" })
                            }
                        })
                        .catch(err => res.status(404).json({ message: "This user does not exists - " + err }))
                } else {
                    return res.status(404).json({ message: "This team does not exists" });
                }
            })
            .catch(err => res.status(404).json({ message: "This team does not exists - " + err }))
    };

    const deleteMember = async (req, res) => {

        //TODO : if user in not a admin of the team : 403

        const { teamId, memberId } = req.params;

        // Team Id validation
        if (!validateIdParam(teamId).idIsValid) {
            return res.status(422).json({ message: validateIdParam(teamId).errors.name });
        }

        // User Id validation
        if (!validateIdParam(memberId).idIsValid) {
            return res.status(422).json({ message: validateIdParam(memberId).errors.name });
        }

        //Search if the team exists
        Team.findById(teamId)
            .then(team => {
                if (team) {
                    //Search if the user exists
                    User.findById(memberId)
                        .then(user => {
                            if (user) {
                                //Delete the user from the team
                                Team.update({ _id: teamId }, {
                                    $pull: {
                                        members: memberId,
                                        admins: memberId
                                    }
                                }, {
                                    multi: true
                                })
                                    .then(team => {
                                        //Delete the team to the user team list
                                        User.updateOne({ _id: memberId }, {
                                            $pull: {
                                                teams: teamId,
                                            }
                                        })
                                            .then(user => {
                                                //Delete the member for all team boards where he is admin
                                                Board.update({ team: teamId }, {
                                                    $pull: {
                                                        admins: memberId,
                                                    }
                                                })
                                                    .then(board => {
                                                        //Get the team to return
                                                        Team.findById(teamId)
                                                            .then(team => res.status(201).send({ team: team, message: 'User successfully deleted from the team' }))
                                                            .catch(err => res.status(404).json({ message: "This team does not exists - " + err }))
                                                    })
                                                    .catch(err => res.status(404).json({ message: "This board does not exists - " + err }))
                                            })
                                            .catch(err => res.status(404).json({ message: "This user does not exists - " + err }))
                                    })
                                    .catch(err => res.status(404).json({ message: "This team does not exists - " + err }));
                            } else {
                                return res.status(404).json({ message: "This user does not exists" })
                            }
                        })
                        .catch(err => res.status(404).json({ message: "This user does not exists - " + err }))
                } else {
                    return res.status(404).json({ message: "This team does not exists" });
                }
            })
            .catch(err => res.status(404).json({ message: "This team does not exists - " + err }))
    };

    /**
     * Update a user role in a team (admin or not)
     * @param {string} teamId.param.required - the team's id
     * @param {string} userId.param.required - the user's id
     * @param {boolean} isAdmin.body.required - the value (true = close, false = open)
     * @returns {code} 201 - Team updated
     */
    const updateMemberRole = async (req, res) => {
        const { teamId, memberId } = req.params;

        // Team Id validation
        if (!validateIdParam(teamId).idIsValid) {
            return res.status(422).json({ message: validateIdParam(teamId).errors.name });
        }

        // User Id validation
        if (!validateIdParam(memberId).idIsValid) {
            return res.status(422).json({ message: validateIdParam(memberId).errors.name });
        }

        if (req.body.isAdmin != false && req.body.isAdmin != true) {
            return res.status(422).json({ message: "isAdmin is invalid" });
        }

        //Search if the team exists
        Team.findOne({ _id: req.params.teamId })
            .then(team => {
                //If the team exists
                if (team) {
                    //Search if the user exists
                    User.findOne({ _id: req.params.memberId })
                        .then(user => {
                            //If the user exists
                            if (user) {
                                if (req.body.isAdmin) {
                                    // add to admin collection
                                    Team.update({ _id: req.params.teamId }, {
                                        $addToSet: {
                                            admins: req.params.memberId
                                        }
                                    })
                                        .then(team => {
                                            Team.findById(req.params.teamId)
                                                .then(team => {
                                                    res.status(201).send({ team: team, message: 'User role successfully updated in the team' });
                                                })
                                                .catch(err => res.status(404).json({ message: "This team does not exists - " + err }));
                                        })
                                        .catch(err => res.status(404).json({ message: "This team does not exists - " + err }));
                                } else {
                                    Team.update({ _id: req.params.teamId }, {
                                        $pull: {
                                            admins: req.params.memberId
                                        }
                                    })
                                        .then(team => {
                                            Team.findById(req.params.teamId)
                                                .then(team => {
                                                    res.status(201).send({ team: team, message: 'User role successfully updated in the team' });
                                                })
                                                .catch(err => res.status(404).json({ message: "This team does not exists - " + err }));
                                        })
                                        .catch(err => res.status(404).json({ message: "This team does not exists - " + err }));
                                }
                            } else {
                                return res.status(404).json({ message: "This user does not exists" })
                            }
                        })
                        .catch(err => res.status(404).json({ message: "This user does not exists - " + err }))
                } else {
                    return res.status(404).json({ message: "This team does not exists" })
                }
            })
            .catch(err => res.status(404).json({ message: "This team does not exists - " + err }))
    };

    const deleteTeam = async (req, res) => {

        //TODO : if user in not a admin of the team : 403

        const teamId = req.params.teamId;

        // Team Id validation
        const { errors, idIsValid } = validateIdParam(teamId);
        if (!idIsValid) {
            return res.status(422).json({ message: errors.name });
        }

        //Search if the team exists
        Team.findById(teamId)
            .then(team => {
                if (team) {
                    //Delete the team
                    Team
                        .deleteOne({ _id: teamId })
                        .then(team => {
                            //Delete the team to the user team list
                            User.update({}, {
                                $pull: {
                                    teams: teamId,
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
        updateTeam,
        getTeamsByUserId,
        addMember,
        deleteMember,
        updateMemberRole,
        deleteTeam
    };
};

module.exports = TeamController;
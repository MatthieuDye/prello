const express = require("express");
const router = express.Router();
const cors = require("cors");

// Load input validation
const validateCreateTeamInput = require("../validation/createTeam");


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

        Team.countDocuments().then(nb => console.log(nb))

        // Form validation
        const { errors, isValid } = validateCreateTeamInput(req.body);

        // Check validation
        if (!isValid) {
            return res.status(422).json({ message: "Invalid input" });
        }

        //Search another team with the same name
        Team.findOne({ name: req.body.name, _id: { $ne: Object(id) } }).then(team => {
            console.log("-------------")
            console.log(team)
            console.log("-------------")

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
            }
        });
    };

    const getTeamsByUserId = async (req, res) => {
        const userId = req.params.userId;
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(422).json({ message: "This user id is not correct" });
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

    // @route PUT api/team/addmember/:teamId/:memberId
    // @desc add a user to the team
    // @access Auth users
    const addMember = async (req, res) => {

        //TODO : if user in not a admin of the team : 403

        let currentTeam;

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
                                            members: req.params.memberId
                                        }
                                    })
                                    .then(team => {
                                        //Add the team to the user team list
                                        User.findById(req.params.memberId).then()
                                        User.updateOne({ _id: req.params.memberId }, {
                                            $addToSet: {
                                                teams: req.params.teamId,
                                            }
                                        })
                                            .then(team => {
                                                //Get the team to return
                                                Team.findById(req.params.teamId)
                                                    .then(team => res.status(201).send({ team: team, message: 'User successfully added to the team' }))
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
                                        members: req.params.memberId,
                                        admins: req.params.memberId
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
                                            .then(user => {
                                                //Delete the member for all team boards where he is admin
                                                Board.update({ team: req.params.teamId }, {
                                                    $pull: {
                                                        admins: req.params.memberId,
                                                    }
                                                })
                                                    .then(board => {
                                                        //Get the team to return
                                                        Team.findById(req.params.teamId)
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
        updateTeam,
        getTeamsByUserId,
        addMember,
        deleteMember,
        deleteTeam
    };
};

module.exports = TeamController;
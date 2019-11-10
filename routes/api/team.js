const express = require("express");
const router = express.Router();

// Load input validation
const validateCreateTeamInput = require("../../validation/createTeam");


// Load Team model
const Team = require("../../models/Team");

// @route POST api/team/creation
// @desc Create the team
// @access Auth users
router.post("/creation", (req, res) => {

    // Form validation
    const {errors, isValid} = validateCreateTeamInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Team.findOne({name: req.body.name}).then(team => {
        if (team) {
            return res.status(400).json({teamName: "This team Name already exists"});
        } else {


            const newTeam = new Team({
                name: req.body.name,
                description: req.body.description,
                members: [{idUser: req.body.userId, isAdmin: true}],
            });
            newTeam
                .save()
                .then(team => res.status(201).send({message: 'Team successfully created', team: team}))
                .catch(err => console.log(err));
        }
    });
});

router.put("/addmember/:teamId/:memberId", (req, res) => {

    //TODO : if user in not a admin of the team : 403

    const team = Team.findById(req.params.teamId);
    if (!team) {
        return res.status(404).json({teamName: "This team does not exists"});
    }


    Team
        .updateOne({_id: req.params.teamId}, {
            $addToSet: {
                members: {
                    idUser: req.params.memberId,
                    isAdmin: req.body.isAdmin
                }
            }
        })
        .then(team => res.status(201).send({message: 'User successfully added to the team'}))
        .catch(err => console.log(err));

});

module.exports = router;
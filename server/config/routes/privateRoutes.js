const privateRoutes = {
    //User
    'POST /user/:id': 'UserController.updateProfile',

    //Team
    'POST /team/create': 'TeamController.createTeam',
    'PUT /team/addmember/:teamId/:memberId': 'TeamController.addMember',
    'DELETE /team/removemember/:teamId/:memberId': 'TeamController.deleteMember',
    'DELETE /team/delete/:teamId': 'TeamController.deleteTeam',
    
};

module.exports = privateRoutes;
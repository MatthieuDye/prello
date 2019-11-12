const privateRoutes = {
    //User
    'POST /user/:id': 'UserController.updateProfile',

    //Team
    'POST /team/create': 'TeamController.createTeam',
    
};

module.exports = privateRoutes;
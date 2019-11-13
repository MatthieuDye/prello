const privateRoutes = {
    //User
    'POST /user/:id': 'UserController.updateProfile',

    //Team
    'POST /team/create': 'TeamController.createTeam',
    
    //Board
    'POST /board/create': 'BoardController.createBoard',
};

module.exports = privateRoutes;
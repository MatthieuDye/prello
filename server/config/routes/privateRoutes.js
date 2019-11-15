const privateRoutes = {
    //User
    'PUT /user/:userName': 'UserController.updateProfile',

    //Team
    'POST /team/create': 'TeamController.createTeam',
    
    //Board
    'POST /board/create': 'BoardController.createBoard',
};

module.exports = privateRoutes;
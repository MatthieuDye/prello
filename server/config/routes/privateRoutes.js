const privateRoutes = {
    //User
    'PUT /user/:userName': 'UserController.updateProfile',

    //Team
    'POST /team/create': 'TeamController.createTeam',
    'GET /user/:userId/teams': 'TeamController.getTeams',
    
    //Board
    'POST /board/create': 'BoardController.createBoard',
    'GET /user/:userId/boards': 'BoardController.getBoards',

};

module.exports = privateRoutes;
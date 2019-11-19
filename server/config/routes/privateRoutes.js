const privateRoutes = {
    //User
    'GET /user/:id': 'UserController.getUser',
    'PUT /user/:userName': 'UserController.updateProfile',
    'PUT /user/:userId/board/favorite/:boardId': 'UserController.updateFavoriteBoards',
    'GET /user/findByBeginName/:query': 'UserController.findByBeginName',

    //Team
    'POST /team/create': 'TeamController.createTeam',
    'GET /user/:userId/teams': 'TeamController.getTeamsByUserId',
    
    //Board
    'POST /board/create': 'BoardController.createBoard',
    'GET /user/:userId/boards': 'BoardController.getBoardsByUserId',

};

module.exports = privateRoutes;
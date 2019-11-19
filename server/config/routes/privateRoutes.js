const privateRoutes = {
    //User
    'GET /user/:id': 'UserController.getUser',
    'PUT /user/:userName': 'UserController.updateProfile',
    'PUT /user/:userId/board/favorite/:boardId': 'UserController.updateFavoriteBoards',
    'GET /user/findByBeginName/:query': 'UserController.findByBeginName',
    'GET /user/:userId/teams': 'UserController.getTeamsByUserId',
    'GET /user/:userId/boards': 'UserController.getBoardsByUserId',

    //Team
    'POST /team/create': 'TeamController.createTeam',
    'GET /team/findByBeginName/:query': 'TeamController.findByBeginName',
    
    //Board
    'POST /board/create': 'BoardController.createBoard',

};

module.exports = privateRoutes;
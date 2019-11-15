const boardAdminRoutes = {

    //Board
    'POST /:boardId/add/user/:memberId': 'BoardController.addMember',
    
};

module.exports = boardAdminRoutes;
const boardAdminRoutes = {

    //Board
    'POST /:boardId/add/user/:memberId': 'BoardController.addMember',
    'DELETE /:boardId/delete/user/:memberId': 'BoardController.deleteMember',
    
};

module.exports = boardAdminRoutes;
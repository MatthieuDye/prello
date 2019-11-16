const boardAdminRoutes = {

    //Board
    'POST /:boardId/add/user/:memberId': 'BoardController.addMember',
    'DELETE /:boardId/delete/user/:memberId': 'BoardController.deleteMember',
    'PUT /:boardId/update/user/role/:memberId': 'BoardController.updateMemberRole',
    
};

module.exports = boardAdminRoutes;
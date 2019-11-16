const boardAdminRoutes = {

    //Board
    'POST /:boardId/add/user/:memberId': 'BoardController.addMember',
    'DELETE /:boardId/delete/user/:memberId': 'BoardController.deleteMember',
    'PUT /:boardId/update/user/role/:memberId': 'BoardController.updateMemberRole',
    'POST /:boardId/add/team/:teamId': 'BoardController.addTeam',
    'DELETE /:boardId/delete/team/:teamId': 'BoardController.deleteTeam',
    
};

module.exports = boardAdminRoutes;
const boardAdminRoutes = {

    //Board
    'PUT /:id/update': 'BoardController.updateBoard',
    'POST /:boardId/add/user/:memberUserName': 'BoardController.addMember',
    'DELETE /:boardId/delete/user/:memberId': 'BoardController.deleteMember',
    'PUT /:boardId/update/user/role/:memberId': 'BoardController.updateMemberRole',
    'POST /:boardId/add/team/:teamName': 'BoardController.addTeam',
    'DELETE /:boardId/delete/team/:teamId': 'BoardController.deleteTeam',
    
};

module.exports = boardAdminRoutes;
const teamAdminRoutes = {

    //Team
    'PUT /:id/update': 'TeamController.updateTeam',
    'POST /:teamId/add/user/:memberUserName': 'TeamController.addMember',
    'DELETE /:teamId/delete/user/:memberId': 'TeamController.deleteMember',
    'DELETE /delete/:teamId': 'TeamController.deleteTeam',
    
};

module.exports = teamAdminRoutes;
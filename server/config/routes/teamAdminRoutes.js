const teamAdminRoutes = {

    //Team
    'POST /:teamId/add/user/:memberId': 'TeamController.addMember',
    'DELETE /:teamId/delete/user/:memberId': 'TeamController.deleteMember',
    'DELETE /delete/:teamId': 'TeamController.deleteTeam',
    
};

module.exports = teamAdminRoutes;
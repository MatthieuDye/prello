const teamAdminRoutes = {

    //Team
    'PUT /addmember/:teamId/:memberId': 'TeamController.addMember',
    'DELETE /removemember/:teamId/:memberId': 'TeamController.deleteMember',
    'DELETE /delete/:teamId': 'TeamController.deleteTeam',
    
};

module.exports = teamAdminRoutes;
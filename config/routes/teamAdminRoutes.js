const teamAdminRoutes = {

    //Team
    'PUT /team/addmember/:teamId/:memberId': 'TeamController.addMember',
    'DELETE /team/removemember/:teamId/:memberId': 'TeamController.deleteMember',
    'DELETE /team/delete/:teamId': 'TeamController.deleteTeam',
    
};

module.exports = teamAdminRoutes;
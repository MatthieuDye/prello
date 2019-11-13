const publicRoutes = {
    //Gestion des utilisateurs
    'POST /user/register': 'UserController.register',
    'POST /user/login': 'UserController.login',
};

module.exports = publicRoutes;
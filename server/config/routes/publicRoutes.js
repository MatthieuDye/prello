const publicRoutes = {
    //Gestion des utilisateurs
    'POST /register': 'UserController.register',
    'POST /login': 'UserController.login',
};

module.exports = publicRoutes;
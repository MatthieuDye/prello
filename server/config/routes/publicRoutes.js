const publicRoutes = {
    //Gestion des utilisateurs
    'POST /register': 'UserController.register',
    'POST /login': 'UserController.login',
    'POST /login/polytech' : 'UserController.loginPolytech'
};

module.exports = publicRoutes;
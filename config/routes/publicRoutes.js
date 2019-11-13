const publicRoutes = {
    //Gestion des utilisateurs
    'POST /user/register': 'UserController.register',
    'POST /user/login': 'UserController.login',
    'POST /user/auth/google': 'UserController.googleAuth',
    'GET /user/auth/google/callback': 'UserController.googleAuthCallback'
};

module.exports = publicRoutes;
const privateRoutes = {
    //User
    'POST /user/:id': 'UserController.updateProfile',

    //Team
    'POST /team/create': 'TeamController.createTeam',
    'PUT /team/addmember/:teamId/:memberId': 'TeamController.addMember',
    'DELETE /team/removemember/:teamId/:memberId': 'TeamController.deleteMember',
    'DELETE /team/delete/:teamId': 'TeamController.deleteTeam',
    
    //Board
    'POST /board/create': 'BoardController.createBoard',
    'GET /board/:id': 'BoardController.getBoard',
    'PUT /board/:id': 'BoardController.updateBoard',
    'POST /board/:id/add/list': 'BoardController.addList',
    'GET /board/:id/lists': 'BoardController.getLists',
    'POST /board/:id/add/label': 'BoardController.addLabel',

    //Card
    'POST /card/create': 'CardController.createCard',
    'GET /card/:id': 'CardController.getCard',
    'DELETE /card/:id': 'CardController.deleteCard',
    'PUT /card/:id': 'CardController.updateCard',
    'POST /card/:id/add/label': 'CardController.addLabel',
    'DELETE /card/:id/label/:id': 'CardController.deleteLabel',

    //Label
    'GET /label/:id': 'LabelController.getLabel',
    'PUT /label/:id': 'LabelController.updateLabel',
    'DELETE /label/:id': 'LabelController.deleteLabel',

    //List
    'GET /list/:id': 'ListController.getList',
    'PUT /list/:id/archive': 'ListController.archiveList',
    'PUT /list/:id/rename': 'ListController.renameList',
    'PUT /list/:id/move': 'ListController.moveList',
};

module.exports = privateRoutes;
const boardMemberRoutes = {

    //Board
    'GET /:id': 'BoardController.getBoard',
  //  'PUT /:id': 'BoardController.updateBoard',
    'POST /:id/add/list': 'BoardController.addList',
    'GET /:id/lists': 'BoardController.getLists',
    'POST /:id/add/label': 'BoardController.addLabel',
    'GET /:boardId/all': 'BoardController.getAllBoardInfo',
    
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
    'POST /list/create': 'ListController.createList',
    'GET /list/:id': 'ListController.getList',
    'PUT /list/:id/archive': 'ListController.archiveList',
    'PUT /list/:id/rename': 'ListController.renameList',
    'DELETE /list/:id': 'ListController.deleteList',
    'PUT /list/:id/move': 'ListController.moveList',
};

module.exports = boardMemberRoutes;
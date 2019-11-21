const request = require('supertest');
const { expect } = require('chai');

const app = require("../server")
const List = require('../models/List');
const Board = require('../models/Board');
const User = require('../models/User');
const Card = require('../models/Card');

const cardData = {
    name: "card name",
    id: ""
};

const newCardData = {
    newName: "new card name",
    newDescription: "",
    newDueDate: "",
    newDueDateIsDone: false,
    newIsArchived: false
};

const userData = {
    firstName: 'test',
    lastName: 'user',
    userName: 'testUser',
    email: 'test@user.fr',
    password: 'testpsw',
    password2: 'testpsw'
};

const boardData = {
    name: "nameBoard",
    description: "board description",
    userId: ""
};

const listData = {
    name: "list name",
    id: ""
};

const userNotBoardMember = {
    firstName: 'notMember',
    lastName: 'notMember',
    userName: 'notMember',
    email: 'notMember@user.fr',
    password: 'notMember',
    password2: 'notMember'
};

let token = null;
let createdBoardId = null;
let createdListId = null;

let tokenNotBoardMember = null;

describe('POST /api/private/board/member/card/create', () => {
    before((done) => {
        Promise.all([List.deleteMany({}), Board.deleteMany({}), User.deleteMany({}), Card.deleteMany({})]).then(async () => {
            try {
                await request(app)
                    .post('/api/public/register')
                    .send(userData)
                    .then((res) => {
                        boardData.userId = res.body.user._id
                    })
                await request(app)
                    .post('/api/public/login')
                    .send({ email: userData.email, password: userData.password })
                    .then((res) => {
                        token = res.body.token;
                    });
                await request(app)
                    .post('/api/public/register')
                    .send(userNotBoardMember);
                await request(app)
                    .post('/api/public/login')
                    .send({ email: userNotBoardMember.email, password: userNotBoardMember.password })
                    .then((res) => {
                        tokenNotBoardMember = res.body.token;
                    });
                await request(app)
                    .post('/api/private/board/create')
                    .send(boardData)
                    .set('Authorization', token)
                    .then((res) => {
                        createdBoardId = res.body.board._id;
                    });
                request(app)
                    .post('/api/private/board/member/list/create')
                    .send({ name: listData.name, boardId: createdBoardId })
                    .set({'Authorization': token, "boardId" :createdBoardId})
                    .end((err, res) => {
                        createdListId = res.body.list._id;
                        done();
                    });
            } catch (err) {
                console.log("ERROR : " + err);
                process.exit(-1);
            }
        })
            .catch(err => console.log("ERROR : " + err));
    });
    it('should return 201 OK', (done) => {
        request(app)
            .post('/api/private/board/member/card/create')
            .send({ name: cardData.name, listId: createdListId })
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.card).to.not.be.undefined;
                expect(res.body.card.name).is.equal(cardData.name);
                cardData.id = res.body.card._id
                done();
            });
    });
    it('should return 401 ERROR', (done) => {
        request(app)
            .post('/api/private/board/member/card/create')
            .send({ name: cardData.name, listId: createdListId })
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 403 ERROR', (done) => {
        request(app)
            .post('/api/private/board/member/card/create')
            .set({'Authorization': tokenNotBoardMember, "boardId" :createdBoardId})
            .send({ name: cardData.name, listId: createdListId })
            .expect('Content-Type', /json/)
            .expect(403, done);
    });
    it('should return 201 OK with the same name', (done) => {
        request(app)
            .post('/api/private/board/member/card/create')
            .send({ name: cardData.name, listId: createdListId })
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.card).to.not.be.undefined;
                expect(res.body.card.name).is.equal(cardData.name);
                done();
            });
    });
    it('should return 422 ERROR with an empty name', (done) => {
        const wrongData = { name: '', listId: createdListId };
        request(app)
            .post('/api/private/board/member/card/create')
            .send(wrongData)
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 422 ERROR with no list', (done) => {
        request(app)
            .post('/api/private/board/member/card/create')
            .send({ name: cardData.name })
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
});

describe('GET /api/private/board/member/card/:cardId', () => {
    it('should return 401 ERROR', (done) => {
        request(app)
            .get('/api/private/board/member/card/' + cardData.id)
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 403 ERROR', (done) => {
        request(app)
            .get('/api/private/board/member/card/' + cardData.id)
            .set({'Authorization': tokenNotBoardMember, "boardId" :createdBoardId})
            .expect('Content-Type', /json/)
            .expect(403, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .get('/api/private/board/member/card/000000000000000000000000')
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .get('/api/private/board/member/card/666')
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 201 OK', (done) => {
        request(app)
            .get('/api/private/board/member/card/' + cardData.id)
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.card).to.not.be.undefined;
                expect(res.body.card.name).is.equal(cardData.name);
                done();
            });
    });
});

describe('PUT /api/private/board/member/card/:cardId', () => {
    it('should return 401 ERROR', (done) => {
        request(app)
            .put(`/api/private/board/member/card/${cardData.id}`)
            .send(newCardData)
            .expect(401, done);
    });
    it('should return 401 ERROR', (done) => {
        request(app)
            .put(`/api/private/board/member/card/${cardData.id}`)
            .set({'Authorization': tokenNotBoardMember, "boardId" :createdBoardId})
            .send(newCardData)
            .expect(403, done);
    });
    it('should return 422 ERROR', (done) => {
        const wrongData = {
            newName: "",
        };
        request(app)
            .put(`/api/private/board/member/card/${cardData.id}`)
            .set({'Authorization': token, "boardId" :createdBoardId})
            .send(wrongData)
            .expect(422, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .put(`/api/private/board/member/card/666`)
            .set({'Authorization': token, "boardId" :createdBoardId})
            .send(newCardData)
            .expect(422, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .put(`/api/private/board/member/card/000000000000000000000000`)
            .set({'Authorization': token, "boardId" :createdBoardId})
            .send(newCardData)
            .expect(404, done);
    });
    it('should return 201 OK', (done) => {
        request(app)
            .put(`/api/private/board/member/card/${cardData.id}`)
            .set({'Authorization': token, "boardId" :createdBoardId})
            .send(newCardData)
            .expect(201, (err, res) => {
                expect(res.body.card).to.not.be.undefined;
                expect(res.body.card.name).is.equal(newCardData.newName);
                done();
            });
    });
});

describe('DELETE /api/private/board/member/card/:cardId', () => {
    it('should return 401 ERROR', (done) => {
        request(app)
            .delete(`/api/private/board/member/card/${cardData.id}`)
            .expect(401, done);
    });
    it('should return 403 ERROR', (done) => {
        request(app)
            .delete(`/api/private/board/member/card/${cardData.id}`)
            .set({'Authorization': tokenNotBoardMember, "boardId" :createdBoardId})
            .expect(403, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .delete(`/api/private/board/member/card/666`)
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect(422, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .delete(`/api/private/board/member/card/000000000000000000000000`)
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect(404, done);
    });
    it('should return 201 OK', (done) => {
        request(app)
            .delete(`/api/private/board/member/card/${cardData.id}`)
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect(201, (err, res) => {
                expect(res.body.card).to.not.be.undefined;
                expect(res.body.card.name).is.equal(cardData.newName);
                done();
            });
    });
});
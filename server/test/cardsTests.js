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

let token = null;
let createdBoardId = null;
let createdListId = null;

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
                    .post('/api/private/board/create')
                    .send(boardData)
                    .set('Authorization', token)
                    .then((res) => {
                        createdBoardId = res.body.board._id;
                    });
                request(app)
                    .post('/api/private/board/member/list/create')
                    .send({ name: listData.name, boardId: createdBoardId })
                    .set('Authorization', token)
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
            .set('Authorization', token)
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
    it('should return 201 OK with the same name', (done) => {
        request(app)
            .post('/api/private/board/member/card/create')
            .send({ name: cardData.name, listId: createdListId })
            .set('Authorization', token)
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
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 422 ERROR with no list', (done) => {
        request(app)
            .post('/api/private/board/member/card/create')
            .send({ name: cardData.name })
            .set('Authorization', token)
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
    it('should return 404 ERROR', (done) => {
        request(app)
            .get('/api/private/board/member/card/000000000000000000000000')
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .get('/api/private/board/member/card/666')
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 201 OK', (done) => {
        request(app)
            .get('/api/private/board/member/card/' + cardData.id)
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.card).to.not.be.undefined;
                expect(res.body.card.name).is.equal(cardData.name);
                done();
            });
    });
});
const request = require('supertest');
const { expect, assert } = require('chai');

const app = require("../server")
const List = require('../models/List');
const Board = require('../models/Board');
const User = require('../models/User');

const listData = {
    name: "team name",
    id: ""
};

const newListData = {
    name: "new team name"
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

let token = null;
let createdBoardId = null;

describe('POST /api/private/board/member/list/create', () => {
    before((done) => {
        Promise.all([List.deleteMany({}), Board.deleteMany({}), User.deleteMany({})]).then(async () => {
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
                request(app)
                    .post('/api/private/board/create')
                    .send(boardData)
                    .set('Authorization', token)
                    .end((err, res) => {
                        createdBoardId = res.body.board._id;
                        done();
                    });
            } catch (err) {
                console.log("ERROR : " + err);
                process.exit(-1);
            }
        })
            .catch(err => console.log("ERROR : " + err));
    });
    it('should return 201 OK with an empty card list', (done) => {
        request(app)
            .post('/api/private/board/member/list/create')
            .send({ name: listData.name, boardId: createdBoardId })
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.list).to.not.be.undefined;
                expect(res.body.list.cards).lengthOf(0);
                listData.id = res.body.list._id
                done();
            });
    });
    it('should return 401 ERROR', (done) => {
        request(app)
            .post('/api/private/board/member/list/create')
            .send({ name: listData.name, boardId: createdBoardId })
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 201 OK with the same name', (done) => {
        request(app)
            .post('/api/private/board/member/list/create')
            .send({ name: listData.name, boardId: createdBoardId })
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.list).to.not.be.undefined;
                expect(res.body.list.cards).lengthOf(0);
                done();
            });
    });
    it('should return 422 ERROR with an empty name', (done) => {
        const wrongData = { name: '', boardId: createdBoardId };
        request(app)
            .post('/api/private/board/member/list/create')
            .send(wrongData)
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 422 ERROR with no board', (done) => {
        request(app)
            .post('/api/private/board/member/list/create')
            .send({ name: listData.name })
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
});


describe('GET /api/private/board/member/list/:listId', () => {
    it('should return 401 ERROR', (done) => {
        request(app)
            .get('/api/private/board/member/list/' + listData.id)
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .get('/api/private/board/member/list/666')
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 201 OK', (done) => {
        request(app)
            .get('/api/private/board/member/list/' + listData.id)
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.list).to.not.be.undefined;
                expect(res.body.list.cards).lengthOf(0);
                done();
            });
    });
});

describe('PUT /api/private/board/member/list/:listId/rename', () => {
    it('should return 401 ERROR', (done) => {
        request(app)
            .put(`/api/private/board/member/list/${listData.id}/rename`)
            .send(newListData)
            .expect(401, done);
    });
    it('should return 422 ERROR', (done) => {
        const wrongData = {
            name: "",
        };
        request(app)
            .put(`/api/private/board/member/list/${listData.id}/rename`)
            .set('Authorization', token)
            .send(wrongData)
            .expect(422, done);
    });
    it('should return 201 OK', (done) => {
        request(app)
            .put(`/api/private/board/member/list/${listData.id}/rename`)
            .send(newListData)
            .set('Authorization', token)
            .expect(201, (err, res) => {
                expect(res.body.list).to.not.be.undefined;
                expect(res.body.list.cards).lengthOf(0);
                expect(res.body.list.name).is.equal(newListData.name);
                done();
            });
    });
});
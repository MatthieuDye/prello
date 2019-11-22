const request = require('supertest');
const { expect } = require('chai');

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

const userNotBoardMember = {
    firstName: 'notMember',
    lastName: 'notMember',
    userName: 'notMember',
    email: 'notMember@user.fr',
    password: 'notMember',
    password2: 'notMember'
};

let tokenNotBoardMember = null;

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
                await request(app)
                    .post('/api/public/register')
                    .send(userNotBoardMember);
                await request(app)
                    .post('/api/public/login')
                    .send({ email: userNotBoardMember.email, password: userNotBoardMember.password })
                    .then((res) => {
                        tokenNotBoardMember = res.body.token;
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
            .set({'Authorization': token, "boardId" :createdBoardId})
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
    it('should return 403 ERROR', (done) => {
        request(app)
            .post('/api/private/board/member/list/create')
            .set({'Authorization': tokenNotBoardMember, "boardId" :createdBoardId})
            .send({ name: listData.name, boardId: createdBoardId })
            .expect('Content-Type', /json/)
            .expect(403, done);
    });
    it('should return 201 OK with the same name', (done) => {
        request(app)
            .post('/api/private/board/member/list/create')
            .send({ name: listData.name, boardId: createdBoardId })
            .set({'Authorization': token, "boardId" :createdBoardId})
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
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 422 ERROR with no board', (done) => {
        request(app)
            .post('/api/private/board/member/list/create')
            .send({ name: listData.name })
            .set({'Authorization': token, "boardId" :createdBoardId})
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
    it('should return 403 ERROR', (done) => {
        request(app)
            .get('/api/private/board/member/list/' + listData.id)
            .set({'Authorization': tokenNotBoardMember, "boardId" :createdBoardId})
            .expect('Content-Type', /json/)
            .expect(403, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .get('/api/private/board/member/list/000000000000000000000000')
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .get('/api/private/board/member/list/666')
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 201 OK', (done) => {
        request(app)
            .get('/api/private/board/member/list/' + listData.id)
            .set({'Authorization': token, "boardId" :createdBoardId})
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
    it('should return 403 ERROR', (done) => {
        request(app)
            .put(`/api/private/board/member/list/${listData.id}/rename`)
            .set({'Authorization': tokenNotBoardMember, "boardId" :createdBoardId})
            .send(newListData)
            .expect(403, done);
    });
    it('should return 422 ERROR', (done) => {
        const wrongData = {
            name: "",
        };
        request(app)
            .put(`/api/private/board/member/list/${listData.id}/rename`)
            .set({'Authorization': token, "boardId" :createdBoardId})
            .send(wrongData)
            .expect(422, done);
    });
    it('should return 422 ERROR', (done) => {
        const wrongData = {
            name: "aaa",
        };
        request(app)
            .put(`/api/private/board/member/list/666/rename`)
            .set({'Authorization': token, "boardId" :createdBoardId})
            .send(wrongData)
            .expect(422, done);
    });
    it('should return 404 ERROR', (done) => {
        const wrongData = {
            name: "aaa",
        };
        request(app)
            .put(`/api/private/board/member/list/000000000000000000000000/rename`)
            .set({'Authorization': token, "boardId" :createdBoardId})
            .send(wrongData)
            .expect(404, done);
    });
    it('should return 201 OK', (done) => {
        request(app)
            .put(`/api/private/board/member/list/${listData.id}/rename`)
            .send(newListData)
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect(201, (err, res) => {
                expect(res.body.list).to.not.be.undefined;
                expect(res.body.list.cards).lengthOf(0);
                expect(res.body.list.name).is.equal(newListData.name);
                done();
            });
    });
});

describe('PUT /api/private/board/member/list/:listId/archive', () => {
    it('should return 401 ERROR', (done) => {
        request(app)
            .put(`/api/private/board/member/list/${listData.id}/archive`)
            .send({ isArchived: false })
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 403 ERROR', (done) => {
        request(app)
            .put(`/api/private/board/member/list/${listData.id}/archive`)
            .set({'Authorization': tokenNotBoardMember, "boardId" :createdBoardId})
            .send({ isArchived: false })
            .expect('Content-Type', /json/)
            .expect(403, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .put(`/api/private/board/member/list/000000000000000000000000/archive`)
            .send({ isArchived: false })
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .put(`/api/private/board/member/list/666/archive`)
            .send({ isArchived: false })
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .put(`/api/private/board/member/list/${listData.id}/archive`)
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 201 OK when unarchived list', (done) => {
        request(app)
            .put(`/api/private/board/member/list/${listData.id}/archive`)
            .send({ isArchived: false })
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.list.isArchived).is.false;
                done();
            });
    });
    it('should return 201 OK when archive a list', (done) => {
        request(app)
            .put(`/api/private/board/member/list/${listData.id}/archive`)
            .send({ isArchived: true })
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.list.isArchived).is.true;
                done();
            });
    });
});

describe('DELETE /api/private/board/member/list/:listId', () => {
    it('should return 401 ERROR', (done) => {
        request(app)
            .delete(`/api/private/board/member/list/${listData.id}`)
            .expect(401, done);
    });
    it('should return 403 ERROR', (done) => {
        request(app)
            .delete(`/api/private/board/member/list/${listData.id}`)
            .set({'Authorization': tokenNotBoardMember, "boardId" :createdBoardId})
            .expect(403, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .delete(`/api/private/board/member/list/666`)
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect(422, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .delete(`/api/private/board/member/list/000000000000000000000000`)
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect(404, done);
    });
    it('should return 201 OK', (done) => {
        request(app)
            .delete(`/api/private/board/member/list/${listData.id}`)
            .set({'Authorization': token, "boardId" :createdBoardId})
            .expect(201, (err, res) => {
                expect(res.body.list).to.not.be.undefined;
                expect(res.body.list.name).is.equal(listData.newName);
                done();
            });
    });
});
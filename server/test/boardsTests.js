const request = require('supertest');
const {expect, assert} = require('chai');

//const app = process.env.SERVER_URI
const app = require("../server");
const User = require('../models/User');
const Board = require('../models/Board');

const boardData = {
    name: "hkhkjhkjh",
    description: "board description",
    userId: "",
    id:""
};

const newBoardData = {
    name: "new board name",
    description: "new board description"

};

const userData = {
    firstName: 'test',
    lastName: 'user',
    userName: 'testUser',
    email: 'test@user.fr',
    password: 'testpsw',
    password2: 'testpsw',
};

const userDataTwo = {
    firstName: 'test',
    lastName: 'user',
    userName: 'testUserTrois',
    email: 'test@t.fr',
    password: 'testpsw',
    password2: 'testpsw',
};

const teamData = {
    name: "team test",
    description: "description",
    userId:"",
    id:""
}

const userNotBoardMember = {
    firstName: 'notMember',
    lastName: 'notMember',
    userName: 'notMember',
    email: 'notMember@user.fr',
    password: 'notMember',
    password2: 'notMember'
};

const userNotBoardAdmin = {
    firstName: 'notAdmin',
    lastName: 'notAdmin',
    userName: 'notAdmin',
    email: 'notAdmin@user.fr',
    password: 'notAdmin',
    password2: 'notAdmin'
};

let tokenNotBoardAdmin = null;
let tokenNotBoardMember = null;
let token;

describe('POST /board/create', () => {
    before((done) => {
        Promise.all([Board.deleteMany({}), User.deleteMany({})]).then(async () => {
            try {
                await request(app)
                    .post('/api/public/register')
                    .send(userData)
                    .then((res) => {
                        boardData.userId = res.body.user._id;
                        teamData.userId = res.body.user._id;
                    });
                await request(app)
                    .post('/api/public/register')
                    .send(userDataTwo)
                    .then((res) => {
                        userDataTwo.userId = res.body.user._id
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
                    .post('/api/public/register')
                    .send(userNotBoardAdmin);
                await request(app)
                    .post('/api/public/login')
                    .send({ email: userNotBoardMember.email, password: userNotBoardMember.password })
                    .then((res) => {
                        tokenNotBoardAdmin = res.body.token;
                    });

                await request(app)
                    .post('/api/public/login')
                    .send({ email: userData.email, password: userData.password })
                    .then((res) => {
                        token = res.body.token;
                    });
            request(app)
            .post('/api/private/board/admin/'+ boardData.id + '/add/user/'+userNotBoardAdmin)
                .set({'Authorization': token, "boardId" : boardData.id})
                .end((err, res) => {
                    done()
                })

            } catch (err) {
                console.log("ERROR : " + err);
                process.exit(-1);
            }
        })
            .catch(err => console.log("ERROR : " + err));
    });
    it('should return 201 OK', (done) => {
        request(app)
            .post('/api/private/board/create')
            .send(boardData)
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.board).to.not.be.undefined;
                boardData.id = res.body.board._id;
                done();
            });
    });
    it('should return 401 ERROR', (done) => {
        request(app)
            .post('/api/private/board/create')
            .send(boardData)
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 409 ERROR', (done) => {
        const redondantBoard = { name: boardData.name, description: "test" };
        request(app)
            .post('/api/private/board/create')
            .send(redondantBoard)
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(409, done);
    });
});

describe('GET /api/private/board/member/:boardId', () => {
    it('should return 401 ERROR', (done) => {
        request(app)
            .get('/api/private/board/member/' + boardData.id)
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 403 ERROR', (done) => {
        request(app)
            .get('/api/private/board/member/' + boardData.id)
            .set({'Authorization': tokenNotBoardMember, "boardId" : boardData.id})
            .expect('Content-Type', /json/)
            .expect(403, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .get('/api/private/board/member/000000000000000000000000')
            .set({'Authorization': token, "boardId" : "000000000000000000000000"})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .get('/api/private/board/member/666')
            .set({'Authorization': token, "boardId" : "666"})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 201 OK', (done) => {
        request(app)
            .get('/api/private/board/member/' + boardData.id)
            .set({'Authorization': token, "boardId" : boardData.id})
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.board).to.not.be.undefined;
                done();
            });
    });
});


describe('PUT /api/private/board/admin/:boardId/update', () => {
    it('should return 401 ERROR', (done) => {
        request(app)
            .put(`/api/private/board/admin/${boardData.id}/update`)
            .send(newBoardData)
            .expect(401, done);
    });
    it('should return 403 ERROR', (done) => {
        request(app)
            .put(`/api/private/board/admin/${boardData.id}/update`)
            .set({'Authorization': tokenNotBoardAdmin, "boardId" : boardData.id})
            .send(newBoardData)
            .expect(403, done);
    });
    it('should return 422 ERROR', (done) => {
        const wrongData = {
            name: "",
            description: "test"
        };
        request(app)
            .put(`/api/private/board/admin/${boardData.id}/update`)
            .set({'Authorization': token, "boardId" : boardData.id})
            .send(wrongData)
            .expect(422, done);
    });
    it('should return 422 ERROR', (done) => {
        const wrongData = {
            name: "aaa",
            description: "test"
        };
        request(app)
            .put(`/api/private/board/admin/666/update`)
            .set({'Authorization': token, "boardId" : "666"})
            .send(wrongData)
            .expect(422, done);
    });
    it('should return 404 ERROR', (done) => {
        const wrongData = {
            name: "aaa",
            description: "test"
        };
        request(app)
            .put(`/api/private/board/admin/000000000000000000000000/update`)
            .set({'Authorization': token, "boardId" : "000000000000000000000000"})
            .send(wrongData)
            .expect(404, done);
    });
    it('should return 201 OK', (done) => {
        request(app)
            .put(`/api/private/board/admin/${boardData.id}/update`)
            .send(newBoardData)
            .set({'Authorization': token, "boardId" : boardData.id})
            .expect(201, (err, res) => {
                expect(res.body.board).to.not.be.undefined;
                expect(res.body.board.name).is.equal(newBoardData.name);
                expect(res.body.board.description).is.equal(newBoardData.description);
                done();
            });
    });
});

describe('GET /api/private/user/:userId/boards', () => {
    it('should return 401 ERROR', (done) => {
        request(app)
            .get('/api/private/user/'+ boardData.userId + '/boards')
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .get('/api/private/user/666/boards')
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .get('/api/private/user/000000000000000000000000/boards')
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 201 OK', (done) => {
        teamData.name = "test get boards";
        request(app)
            .post('/api/private/team/create')
            .send(teamData)
            .set('Authorization', token)
            .then(res => {
                const teamId = res.body.team._id;
                request(app)
                    .post('/api/private/board/admin/' + boardData.id + '/add/team/' + teamId)
                    .set('Authorization', token)
                    .then(result => {
                        request(app)
                            .post(`/api/private/team/admin/${teamId}/add/user/${boardData.userId}`)
                            .set('Authorization', token)
                            .then(resu => {
                                request(app)
                                    .get('/api/private/user/' + boardData.userId + '/boards')
                                    .set('Authorization', token)
                                    .expect('Content-Type', /json/)
                                    .expect(201, (err, res) => {
                                        expect(!(res.body.boards.guestBoards === undefined));
                                        expect(res.body.boards.teamsBoards.length === 1);
                                        done();
                                    })
                            });
                    });
            })
    });
});


describe('PUT /api/private/board/admin/:boardId/add/user/:userName', () => {
    it('should return 401 ERROR', (done) => {
        request(app)
            .post('/api/private/board/admin/'+ boardData.id + '/add/user/' + userDataTwo.userName)
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 403 ERROR', (done) => {
        request(app)
            .post('/api/private/board/admin/'+ boardData.id + '/add/user/' + userDataTwo.userName)
            .set({'Authorization': tokenNotBoardAdmin, "boardId" : boardData.id})
            .expect('Content-Type', /json/)
            .expect(403, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .post('/api/private/board/admin/'+ boardData.id + '/add/user/jkh')
            .set({'Authorization': token, "boardId" : boardData.id})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .post('/api/private/board/admin/sdfsdf/add/user/'+userDataTwo.userName)
            .set({'Authorization': token, "boardId" : "sdfsdf"})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .post('/api/private/board/admin/000000000000000000000000/add/user/'+userDataTwo.userName)
            .set({'Authorization': token, "boardId" : "000000000000000000000000"})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 201 OK', (done) => {
        request(app)
            .post('/api/private/board/admin/'+ boardData.id + '/add/user/' + userDataTwo.userName)
            .set({'Authorization': token, "boardId" : boardData.id})
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.board.admins.includes(userDataTwo.userId));
                expect(res.body.board.guestMembers.includes(userDataTwo.userId));
                done();
            });
    });
});

describe('DELETE /api/private/board/admin/:boardId/delete/user/:userId', () => {
    it('should return 401 ERROR', (done) => {
        request(app)
            .delete('/api/private/board/admin/'+ boardData.id + '/delete/user/' + boardData.userId)
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 403 ERROR', (done) => {
        request(app)
            .delete('/api/private/board/admin/'+ boardData.id + '/delete/user/' + boardData.userId)
            .set({'Authorization': tokenNotBoardAdmin, "boardId" : boardData.id})
            .expect('Content-Type', /json/)
            .expect(403, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .delete('/api/private/board/admin/'+ boardData.id + '/delete/user/jkh')
            .set({'Authorization': token, "boardId" : boardData.id})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .delete('/api/private/board/admin/sdfsdf/delete/user/'+boardData.userId)
            .set({'Authorization': token, "boardId" : "sdfsdf"})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .delete('/api/private/board/admin/'+ boardData.id + '/delete/user/000000000000000000000000')
            .set({'Authorization': token, "boardId" : boardData.id})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .delete('/api/private/board/admin/000000000000000000000000/delete/user/'+boardData.userId)
            .set({'Authorization': token, "boardId" : "000000000000000000000000"})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 201 OK', (done) => {

        request(app)
            .post('/api/private/board/admin/'+ boardData.id + '/add/user/' + userDataTwo.userId)
            .send({isAdmin: true})
            .set({'Authorization': token, "boardId" : boardData.id})
        .then(

        request(app)
            .delete('/api/private/board/admin/'+ boardData.id + '/delete/user/' + userDataTwo.userId)
            .set({'Authorization': token, "boardId" : boardData.id})
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(!res.body.board.admins.includes(userDataTwo.userId));
                expect(!res.body.board.guestMembers.includes(userDataTwo.userId));
                done();
            }));
    });
});

describe('PUT /api/private/board/admin/:boardId/update/user/role/:userId', () => {
    it('should return 401 ERROR', (done) => {
        request(app)
            .put('/api/private/board/admin/'+ boardData.id + '/update/user/role/' + boardData.userId)
            .send({isAdmin: false})
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 403 ERROR', (done) => {
        request(app)
            .put('/api/private/board/admin/'+ boardData.id + '/update/user/role/' + boardData.userId)
            .set({'Authorization': tokenNotBoardAdmin, "boardId" : boardData.id})
            .send({isAdmin: false})
            .expect('Content-Type', /json/)
            .expect(403, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .put('/api/private/board/admin/'+ boardData.id + '/update/user/role/000000000000000000000000')
            .send({isAdmin: false})
            .set({'Authorization': token, "boardId" : boardData.id})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .put('/api/private/board/admin/000000000000000000000000/update/user/role/'+boardData.userId)
            .send({isAdmin: false})
            .set({'Authorization': token, "boardId" : "000000000000000000000000"})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .put('/api/private/board/admin/'+ boardData.id + '/update/user/role/jkh')
            .send({isAdmin: false})
            .set({'Authorization': token, "boardId" : boardData.id})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .put('/api/private/board/admin/sdfsdf/update/user/role/'+boardData.userId)
            .send({isAdmin: false})
            .set({'Authorization': token, "boardId" : "sdfsdf"})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .put('/api/private/board/admin/' + boardData.id + '/update/user/role/'+boardData.userId)
            .set({'Authorization': token, "boardId" : boardData.id})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 201 OK', (done) => {
        request(app)
            .post('/api/private/board/admin/'+ boardData.id + '/add/user/' + userDataTwo.userId)
            .set({'Authorization': token, "boardId" : boardData.id})
            .set('Authorization', token)
            .then(
                request(app)
                    .put('/api/private/board/admin/'+ boardData.id + '/update/user/role/' + userDataTwo.userId)
                    .send({isAdmin: false})
                    .set({'Authorization': token, "boardId" : boardData.id})
                    .expect('Content-Type', /json/)
                    .expect(201, (err, res) => {
                        expect(!res.body.board.admins.includes(userDataTwo.userId));
                        expect(res.body.board.guestMembers.includes(userDataTwo.userId));
                        done();
                    }));
    });
    it('should return 201 OK', (done) => {
        request(app)
            .post('/api/private/board/admin/'+ boardData.id + '/add/user/' + userDataTwo.userId)
            .send({isAdmin: false})
            .set({'Authorization': token, "boardId" : boardData.id})
            .then(
                request(app)
                    .put('/api/private/board/admin/'+ boardData.id + '/update/user/role/' + userDataTwo.userId)
                    .send({isAdmin: true})
                    .set({'Authorization': token, "boardId" : boardData.id})
                    .expect('Content-Type', /json/)
                    .expect(201, (err, res) => {
                        expect(res.body.board.admins.includes(userDataTwo.userId));
                        expect(res.body.board.guestMembers.includes(userDataTwo.userId));
                        done();
                    }));
    });
});

describe('POST /api/private/board/admin/:boardId/add/team/:teamName', () => {
    it('should return 401 ERROR', (done) => {
        request(app)
            .post('/api/private/board/admin/'+ boardData.id + '/add/team/' + teamData.name)
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 403 ERROR', (done) => {
        request(app)
            .post('/api/private/board/admin/'+ boardData.id + '/add/team/' + teamData.name)
            .set({'Authorization': tokenNotBoardAdmin, "boardId" : boardData.id})
            .expect('Content-Type', /json/)
            .expect(403, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .post('/api/private/board/admin/'+ boardData.id + '/add/team/666')
            .set({'Authorization': token, "boardId" : boardData.id})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .post('/api/private/board/admin/000000000000000000000000/add/team/'+teamData.name)
            .set({'Authorization': token, "boardId" : "000000000000000000000000"})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .post('/api/private/board/admin/sdfsdf/add/team/'+teamData.name)
            .set({'Authorization': token, "boardId" : "sdfsdf"})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 201 OK', (done) => {
        teamData.name = "test add team to board"
        request(app)
            .post('/api/private/team/create')
            .send(teamData)
            .set({'Authorization': token, "boardId" : boardData.id})
            .then(res => {
                    const teamName = res.body.team.name;
                    request(app)
                        .post('/api/private/board/admin/' + boardData.id + '/add/team/' + teamName)
                        .set({'Authorization': token, "boardId" : boardData.id})
                        .expect('Content-Type', /json/)
                        .expect(201, (err, res) => {
                            expect(res.body.board.team.name).is.equal(teamName);
                            done();
                        })
                }
            );
    });
});

describe('DELETE /api/private/board/admin/:boardId/delete/team/:teamId', () => {
    it('should return 401 ERROR', (done) => {
        request(app)
            .delete('/api/private/board/admin/'+ boardData.id + '/delete/team/' + boardData.userId)
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 403 ERROR', (done) => {
        request(app)
            .delete('/api/private/board/admin/'+ boardData.id + '/delete/team/' + boardData.userId)
            .set({'Authorization': tokenNotBoardAdmin, "boardId" : boardData.id})
            .expect('Content-Type', /json/)
            .expect(403, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .delete('/api/private/board/admin/'+ boardData.id + '/delete/team/000000000000000000000000')
            .set({'Authorization': token, "boardId" : boardData.id})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .delete('/api/private/board/admin/000000000000000000000000/delete/team/'+boardData.userId)
            .set({'Authorization': token, "boardId" : "000000000000000000000000"})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .delete('/api/private/board/admin/'+ boardData.id + '/delete/team/jkh')
            .set({'Authorization': token, "boardId" : boardData.id})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .delete('/api/private/board/admin/sdfsdf/delete/team/'+boardData.userId)
            .set({'Authorization': token, "boardId" : boardData.id})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 201 OK', (done) => {
        teamData.name = "deuxieme test";
        request(app)
            .post('/api/private/team/create')
            .send(teamData)
            .set({'Authorization': token, "boardId" : boardData.id})
            .then(res => {
                    const teamId = res.body.team._id;
                    request(app)
                        .post('/api/private/board/admin/' + boardData.id + '/add/team/' + teamId)
                        .set('Authorization', token)
                        .then(res => {
                            request(app)
                                .delete('/api/private/board/admin/' + boardData.id + '/delete/team/' + teamId)
                                .set({'Authorization': token, "boardId" : boardData.id})
                                .expect('Content-Type', /json/)
                                .expect(201, (err, res) => {
                                    expect(res.body.board.name === boardData.name);
                                    expect(res.body.board.team === undefined);
                                    done();
                                })
                        })
                }
            );
    });
});

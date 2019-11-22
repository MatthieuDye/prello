const request = require('supertest');
const { expect, assert } = require('chai');

const app = require("../server")
const Team = require('../models/Team');
const User = require('../models/User');

const teamData = {
    name: "team name",
    description: "team description",
    id: ""
};

const otherTeamData = {
    name: "other team name",
    description: "other team description"
};

const newTeamData = {
    name: "new team name",
    description: "new team description"
};

const userData = {
    firstName: 'test',
    lastName: 'user',
    userName: 'testUser',
    email: 'test@user.fr',
    password: 'testpsw',
    password2: 'testpsw',
};

const otherUserData = {
    firstName: 'otherTest',
    lastName: 'otherUser',
    userName: 'otherTestUser',
    email: 'othertest@user.fr',
    password: 'azerty',
    password2: 'azerty',
};

const userNotAdminData = {
    firstName: 'notAdmin',
    lastName: 'notAdmin',
    userName: 'notAdmin',
    email: 'notadmin@user.fr',
    password: 'notAdmin',
    password2: 'notAdmin',
};

let token = null;
let createdUserId = null;
let token2 = null;
let createdUserId2 = null;
let createdUserName2 = null;

let idNotAdmin = null;
let tokenNotAdmin = null;

describe('POST /api/private/team/create', () => {
    before((done) => {
        Promise.all([Team.deleteMany({}), User.deleteMany({})]).then(async () => {
            try {
                await request(app)
                    .post('/api/public/register')
                    .send(userData)
                    .then((res) => {
                        createdUserId = res.body.user._id
                    })
                request(app)
                    .post('/api/public/login')
                    .send({ email: userData.email, password: userData.password })
                    .end((err, res) => {
                        token = res.body.token;
                        done();
                    });
            } catch (err) {
                console.log("ERROR : " + err);
                process.exit(-1);
            }
        })
            .catch(err => console.log("ERROR : " + err));
    });
    it('should return 201 OK and fill the members and admins lists', (done) => {
        request(app)
            .post('/api/private/team/create')
            .send({ name: teamData.name, description: teamData.description, userId: createdUserId })
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.team).to.not.be.undefined;
                expect(res.body.team.members).lengthOf(1);
                expect(res.body.team.admins).lengthOf(1);
                teamData.id = res.body.team._id;
                done();
            });
    });
    it('should return 401 ERROR', (done) => {
        request(app)
            .post('/api/private/team/create')
            .send({ name: teamData.name, description: teamData.description, userId: createdUserId })
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 409 ERROR', (done) => {
        const redondantTeam = { name: teamData.name, description: "test", userId: createdUserId };
        request(app)
            .post('/api/private/team/create')
            .send(redondantTeam)
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(409, done);
    });
    it('should return 422 ERROR with an empty name', (done) => {
        const wrongData = { name: '', userId: createdUserId };
        request(app)
            .post('/api/private/team/create')
            .send(wrongData)
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 422 ERROR with no user', (done) => {
        request(app)
            .post('/api/private/team/create')
            .send({ name: teamData.name, description: teamData.description })
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 201 OK with new values', (done) => {
        request(app)
            .post('/api/private/team/create')
            .send({ name: otherTeamData.name, description: otherTeamData.description, userId: createdUserId })
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.team).to.not.be.undefined;
                expect(res.body.team.members).lengthOf(1);
                expect(res.body.team.admins).lengthOf(1);
                done();
            });
    });
});



describe('PUT /api/private/team/admin/:teamId/update', () => {

    before((done) => {
        request(app)
            .post('/api/public/register')
            .send(userNotAdminData)
            .then(res => {
                idNotAdmin = res.body.user._id;
                request(app)
                    .post('/api/public/login')
                    .send({ email: userNotAdminData.email, password: userNotAdminData.password })
                    .end((err, response) => {
                        tokenNotAdmin = response.body.token;
                        done();
                    });
            });
    });

    it('should return 401 ERROR', (done) => {
        request(app)
            .put(`/api/private/team/admin/${teamData.id}/update`)
            .send(newTeamData)
            .expect(401, done);
    });
    it('should return 403 ERROR', (done) => {
        request(app)
            .put(`/api/private/team/admin/${teamData.id}/update`)
            .send(newTeamData)
            .set({'Authorization': tokenNotAdmin, "teamId": teamData.id})
            .expect(403,done);
    });
    it('should return 422 ERROR', (done) => {
        const wrongData = {
            name: "",
            description: "test"
        };
        request(app)
            .put(`/api/private/team/admin/${teamData.id}/update`)
            .set({'Authorization': token, "teamId" : teamData.id})
            .send(wrongData)
            .expect(422, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .put(`/api/private/team/admin/666/update`)
            .set({'Authorization': token, "teamId" : 666})
            .send(newTeamData)
            .expect(422, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .put(`/api/private/team/admin/000000000000000000000000/update`)
            .set({'Authorization': token, "teamId" : "000000000000000000000000"})
            .send(newTeamData)
            .expect(404, done);
    });
    it('should return 409 ERROR with a name already existing', (done) => {
        request(app)
            .put(`/api/private/team/admin/${teamData.id}/update`)
            .set({'Authorization': token, "teamId" : teamData.id})
            .send(otherTeamData)
            .expect(409, done);
    });
    it('should return 201 OK', (done) => {
        request(app)
            .put(`/api/private/team/admin/${teamData.id}/update`)
            .send(newTeamData)
            .set({'Authorization': token, "teamId" : teamData.id})
            .expect(201, (err, res) => {
                expect(res.body.team).to.not.be.undefined;
                expect(res.body.team.name).is.equal(newTeamData.name);
                expect(res.body.team.description).is.equal(newTeamData.description);
                done();
            });
    });
});

describe('GET /api/private/user/:userId/teams', () => {
    it('should return 401 ERROR', (done) => {
        request(app)
            .get('/api/private/user/' + createdUserId + '/teams')
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .get('/api/private/user/666/teams')
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .get('/api/private/user/000000000000000000000000/teams')
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 201 OK', (done) => {
        request(app)
            .get('/api/private/user/' + createdUserId + '/teams')
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.teams.length === 1);
                done();
            });
    });
});

describe('POST /api/private/team/admin/:teamId/add/user/:memberUserName', () => {
    before(async () => {
        try {
            await request(app)
                .post('/api/public/register')
                .send(otherUserData)
                .then((res) => {
                    createdUserId2 = res.body.user._id
                    createdUserName2 = res.body.user.userName
                })
            request(app)
                .post('/api/public/login')
                .send({ email: otherUserData.email, password: otherUserData.password })
                .end((err, res) => {
                    token2 = res.body.token;
                });
        } catch (err) {
            console.log("ERROR : " + err);
            process.exit(-1);
        }
    });
    it('should return 401 ERROR', (done) => {
        request(app)
            .post(`/api/private/team/admin/${teamData.id}/add/user/${otherUserData.userName}`)
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 403 ERROR', (done) => {
        request(app)
            .post(`/api/private/team/admin/${teamData.id}/add/user/${otherUserData.userName}`)
            .send(newTeamData)
            .set({'Authorization': tokenNotAdmin, "teamId": teamData.id})
            .expect(403,done);
    });
    it('should return 404 ERROR with a false teamId', (done) => {
        request(app)
            .post(`/api/private/team/admin/000000000000000000000000/add/user/${otherUserData.userName}`)
            .set({'Authorization': token, "teamId" : "000000000000000000000000"})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 404 ERROR with a false userId', (done) => {
        request(app)
            .post(`/api/private/team/admin/${teamData.id}/add/user/000000000000000000000000`)
            .set({'Authorization': token, "teamId" : teamData.id})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 422 ERROR with a false teamId', (done) => {
        request(app)
            .post(`/api/private/team/admin/666/add/user/${otherUserData.userName}`)
            .set({'Authorization': token, "teamId" : "666"})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 201 OK and not fill the members and admins lists', (done) => {
        request(app)
            .post(`/api/private/team/admin/${teamData.id}/add/user/${otherUserData.userName}`)
            .set({'Authorization': token, "teamId" : teamData.id})
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.team).to.not.be.undefined;
                expect(res.body.team.members).lengthOf(2);
                expect(res.body.team.admins).lengthOf(1);
                done();
            });
    });
    it('should return 201 OK and fill the members list but not the admins list', (done) => {
        request(app)
            .post(`/api/private/team/admin/${teamData.id}/add/user/${otherUserData.userName}`)
            .set({'Authorization': token, "teamId" : teamData.id})
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.team).to.not.be.undefined;
                expect(res.body.team.members).lengthOf(2);
                expect(res.body.team.admins).lengthOf(1);
                done();
            });
    });
});

describe('DELETE /api/private/team/admin/:teamId/delete/user/:userId', () => {
    it('should return 401 ERROR', (done) => {
        request(app)
            .delete(`/api/private/team/admin/${teamData.id}/delete/user/${createdUserId}`)
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 403 ERROR', (done) => {
        request(app)
            .delete(`/api/private/team/admin/${teamData.id}/delete/user/${createdUserId}`)
            .set({'Authorization': tokenNotAdmin, "teamId": teamData.id})
            .expect(403,done);
    });
    it('should return 404 ERROR with a false teamId', (done) => {
        request(app)
            .delete(`/api/private/team/admin/000000000000000000000000/delete/user/${createdUserId}`)
            .set({'Authorization': token, "teamId" : "000000000000000000000000"})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 404 ERROR with a false userId', (done) => {
        request(app)
            .delete(`/api/private/team/admin/${teamData.id}/delete/user/000000000000000000000000`)
            .set({'Authorization': token, "teamId" : teamData.id})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 422 ERROR with a false teamId', (done) => {
        request(app)
            .delete(`/api/private/team/admin/666/delete/user/${createdUserId}`)
            .set({'Authorization': token, "teamId" : "666"})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 422 ERROR with a false userId', (done) => {
        request(app)
            .delete(`/api/private/team/admin/${teamData.id}/delete/user/666`)
            .set({'Authorization': token, "teamId" : teamData.id})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 201 OK and pull the members list but not the admins list', (done) => {
        request(app)
            .delete(`/api/private/team/admin/${teamData.id}/delete/user/${createdUserId2}`)
            .set({'Authorization': token, "teamId" : teamData.id})
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.team).to.not.be.undefined;
                expect(res.body.team.members).lengthOf(1);
                expect(res.body.team.admins).lengthOf(1);
                done();
            });
    });
    it('should return 201 OK and not update members and admins lists', (done) => {
        request(app)
            .delete(`/api/private/team/admin/${teamData.id}/delete/user/${createdUserId2}`)
            .set({'Authorization': token, "teamId" : teamData.id})
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.team).to.not.be.undefined;
                expect(res.body.team.members).lengthOf(1);
                expect(res.body.team.admins).lengthOf(1);
                done();
            });
    });
    it('should return 201 OK and pull members and admins lists', (done) => {
        request(app)
            .delete(`/api/private/team/admin/${teamData.id}/delete/user/${createdUserId}`)
            .set({'Authorization': token, "teamId" : teamData.id})
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.team).to.not.be.undefined;
                expect(res.body.team.members).lengthOf(0);
                expect(res.body.team.admins).lengthOf(0);
                done();
            });
    });
});

describe('PUT /api/private/team/admin/:teamId/update/user/role/:userId', () => {
    let currentTeamId;
    before((done) => {
        request(app)
            .post('/api/private/team/create')
            .send({ name: teamData.name + "2", description: teamData.description, userId: createdUserId })
            .set('Authorization', token)
            .then((res) => {
                currentTeamId = res.body.team._id
                request(app)
                    .post(`/api/private/team/admin/${currentTeamId}/add/user/${createdUserName2}`)
                    .set('Authorization', token)
                    .then(done())
            })
    });
    it('should return 401 ERROR', (done) => {
        request(app)
            .put('/api/private/team/admin/' + currentTeamId + '/update/user/role/' + createdUserId)
            .send({ isAdmin: false })
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 403 ERROR', (done) => {
        request(app)
            .put('/api/private/team/admin/' + currentTeamId + '/update/user/role/' + createdUserId)
            .send({ isAdmin: false })
            .set({'Authorization': tokenNotAdmin, "teamId": currentTeamId})
            .expect(403,done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .put('/api/private/team/admin/' + currentTeamId + '/update/user/role/000000000000000000000000')
            .send({ isAdmin: false })
            .set({'Authorization': token, "teamId" : currentTeamId})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .put('/api/private/team/admin/000000000000000000000000/update/user/role/' + createdUserId)
            .send({ isAdmin: false })
            .set({'Authorization': token, "teamId" : "000000000000000000000000"})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .put('/api/private/team/admin/' + currentTeamId + '/update/user/role/jkh')
            .send({ isAdmin: false })
            .set({'Authorization': token, "teamId" : currentTeamId})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .put('/api/private/team/admin/sdfsdf/update/user/role/' + createdUserId)
            .send({ isAdmin: false })
            .set({'Authorization': token, "teamId" : "sdfsdf"})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .put('/api/private/team/admin/' + currentTeamId + '/update/user/role/' + createdUserId)
            .set({'Authorization': token, "teamId" : currentTeamId})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 201 OK when add an admin', (done) => {
        request(app)
            .put('/api/private/team/admin/' + currentTeamId + '/update/user/role/' + createdUserId2)
            .send({ isAdmin: true })
            .set({'Authorization': token, "teamId" : currentTeamId})
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.team.admins.includes(createdUserId2));
                expect(res.body.team.members.includes(createdUserId2));
                expect(res.body.team.admins).lengthOf(2);
                expect(res.body.team.members).lengthOf(1);
                done();
            });
    });
    it('should return 201 OK when delete an admin', (done) => {
        request(app)
            .put('/api/private/team/admin/' + currentTeamId + '/update/user/role/' + createdUserId)
            .send({ isAdmin: false })
            .set({'Authorization': token, "teamId" : currentTeamId})
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(!res.body.team.admins.includes(createdUserId));
                expect(res.body.team.members.includes(createdUserId));
                expect(res.body.team.admins).lengthOf(1);
                expect(res.body.team.members).lengthOf(1);
                done();
            });
    });
});
describe('GET /api/private/team/member/:teamId', () => {
    let currentTeamId3;
    before((done) => {
        request(app)
            .post('/api/private/team/create')
            .send({ name: teamData.name + "33", description: teamData.description, userId: createdUserId})
            .set('Authorization', token)
            .end((err, res) => {
                currentTeamId3 = res.body.team._id;
                done();
            });

    });
    it('should return 401 ERROR', (done) => {
        request(app)
            .get('/api/private/team/member/' + teamData.id)
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 403 ERROR', (done) => {
        request(app)
            .get('/api/private/team/member/' + currentTeamId3)
            .set({'Authorization' : token2, 'teamId': currentTeamId3})
            .expect('Content-Type', /json/)
            .expect(403, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .get('/api/private/team/member/000000000000000000000000')
            .set({'Authorization' : token, 'teamId': "000000000000000000000000"})
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .get('/api/private/team/member/666')
            .set({'Authorization' : token, 'teamId': "666"})
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 201 OK', (done) => {
        request(app)
            .get('/api/private/team/member/' + currentTeamId3)
            .set({'Authorization' : token, 'teamId': currentTeamId3})
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.team).to.not.be.undefined;
                done();
            });
    });
});
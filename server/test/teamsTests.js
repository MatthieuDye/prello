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

const userData = {
    firstName: 'test',
    lastName: 'user',
    userName: 'testUser',
    email: 'test@user.fr',
    password: 'testpsw',
    password2: 'testpsw',
};

let token = null;
let createdUserId = null;

describe('POST /api/private/team/create', () => {
    before((done) => {
        Promise.all([Team.deleteMany({}), User.deleteMany({})]).then(async () => {
            try {
                user = await request(app)
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
    it('should return 201 OK', (done) => {
        request(app)
            .post('/api/private/team/create')
            .send({name: teamData.name, description: teamData.description, userId: createdUserId})
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.team).to.not.be.undefined;
                teamData.id = res.body.team._id;
                done();
            });
    });
    it('should return 401 ERROR', (done) => {
        request(app)
            .post('/api/private/team/create')
            .send({name: teamData.name, description: teamData.description, userId: createdUserId})
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
    it('should return 422 ERROR', (done) => {
        const wrongData = { name: '', userId: createdUserId };
        request(app)
            .post('/api/private/team/create')
            .send(wrongData)
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .post('/api/private/team/create')
            .send({name: teamData.name, description: teamData.description})
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
});

describe('GET /api/private/team/member/:teamid', () => {
    it('should return 401 ERROR', (done) => {
        request(app)
            .get('/api/private/team/member/' + teamData.id)
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .get('/api/private/team/member/666')
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 201 OK', (done) => {
        request(app)
            .get('/api/private/team/member/' + teamData.id)
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.team).to.not.be.undefined;
                done();
            });
    });
});

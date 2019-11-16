const request = require('supertest');
const { expect, assert } = require('chai');

require('dotenv').config();
const app = require("../server")
const Team = require('../models/Team');
const User = require('../models/User');

const teamData = {
    name: "team name",
    description: "team description",
};

const newTeam = {
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

describe('POST /api/private/team/create', () => {
    before((done) => {
        Promise.all([Team.deleteMany({}), User.deleteMany({})]).then(async () => {
            try {
                await request(app)
                    .post('/api/public/register')
                    .send(userData)
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
            .send(teamData)
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.team).to.not.be.undefined;
                newTeam.id = res.body.team._id;
                done();
            });
    });
    it('should return 401 ERROR', (done) => {
        request(app)
            .post('/api/private/team/create')
            .send(teamData)
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 409 ERROR', (done) => {
        const redondantTeam = { name: teamData.name, description: "test" };
        request(app)
            .post('/api/private/team/create')
            .send(redondantTeam)
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(409, done);
    });
    it('should return 422 ERROR', (done) => {
        const wrongData = { name: '' };
        request(app)
            .post('/api/private/team/create')
            .send(wrongData)
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
});

describe('GET /api/private/team/member/:teamid', () => {
    it('should return 401 ERROR', (done) => {
        request(app)
            .get('/api/private/team/member/' + newTeam.id)
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
            .get('/api/private/team/member/' + newTeam.id)
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                console.log("BODY : " + res.body)
                expect(res.body.team).to.not.be.undefined;
                done();
            });
    });
});

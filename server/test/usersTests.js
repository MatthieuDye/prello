const request = require('supertest');
const { expect, assert } = require('chai');

require('dotenv').config();
//const app = process.env.SERVER_URI
const app = require("../server")
const User = require('../models/User');

const data = {
    firstName: 'test',
    lastName: 'user',
    userName: 'testUser',
    email: 'test@user.fr',
    password: 'testpsw',
    password2: 'testpsw',
};

const otherData = {
    firstName: 'otherTest',
    lastName: 'otherUser',
    userName: 'otherTestUser',
    email: 'othertest@user.fr',
    password: 'azerty',
    password2: 'azerty',
};

describe('POST /api/public/register', () => {
    before(async () => {
        await User.deleteMany({});
    });
    it('should return 201 OK', (done) => {
        request(app)
            .post('/api/public/register')
            .send(data)
            .expect('Content-Type', /json/)
            .expect(201, done);
    });
    it('should return 409 ERROR', (done) => {
        request(app)
            .post('/api/public/register')
            .send(data)
            .expect('Content-Type', /json/)
            .expect(409, done);
    });
    it('should return 422 ERROR', (done) => {
        const wrongData = {
            email: '',
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            userName: data.userName,
            password2: data.firstName
        };
        request(app)
            .post('/api/public/register')
            .send(wrongData)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 422 ERROR', (done) => {
        const wrongData = {
            email: data.email,
            password: "test",
            firstName: data.firstName,
            lastName: data.lastName,
            userName: data.userName,
            password2: "test"
        };
        request(app)
            .post('/api/public/register')
            .send(wrongData)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 422 ERROR', (done) => {
        const wrongData = {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            userName: "az",
            password2: data.password2
        };
        request(app)
            .post('/api/public/register')
            .send(wrongData)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 422 ERROR', (done) => {
        const wrongData = {
            email: "test",
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            userName: data.userName,
            password2: data.password2
        };
        request(app)
            .post('/api/public/register')
            .send(wrongData)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 422 ERROR', (done) => {
        const wrongData = {
            email: data.email,
            password: "password",
            firstName: data.firstName,
            lastName: data.lastName,
            userName: data.userName,
            password2: "notSamePassword"
        };
        request(app)
            .post('/api/public/register')
            .send(wrongData)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
});

describe('POST /api/public/login', () => {
    it('should return 201 OK', (done) => {
        request(app)
            .post('/api/public/login')
            .send({ email: data.email, password: data.password })
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.token).to.not.be.undefined;
                done();
            });
    });

    it('should return 422 ERROR', (done) => {
        request(app)
            .post('/api/public/login')
            .send({ email: '', password: data.password })
            .expect('Content-Type', /json/)
            .expect(422, done);
    });

    it('should return 403 ERROR', (done) => {
        request(app)
            .post('/api/public/login')
            .send({ email: 'unknown@test.fr', password: data.password })
            .expect('Content-Type', /json/)
            .expect(403, done);
    });

    it('should return 403 ERROR', (done) => {
        request(app)
            .post('/api/public/login')
            .send({ email: data.email, password: 'wrongpassword' })
            .expect('Content-Type', /json/)
            .expect(403, done);
    });
});

describe('PUT /api/private/user/:username', () => {
    let token = null;
    before((done) => {
        request(app)
            .post('/api/public/login')
            .send({ email: data.email, password: data.password })
            .end((err, res) => {
                token = res.body.token;
                done();
            });
        request(app)
            .post('/api/public/register')
            .send(otherData)
    });
    it('should return 401 ERROR', (done) => {
        request(app)
            .put('/api/private/user/' + data.userName)
            .send(data)
            .expect(401, done);
    });
    it('should return 422 ERROR', (done) => {
        const wrongData = {
            email: "",
            firstName: data.firstName,
            lastName: data.lastName,
            userName: data.userName,
        };
        request(app)
            .put('/api/private/user/' + data.userName)
            .set('Authorization', token)
            .send(wrongData)
            .expect(422, done);
    });
    it('should return 422 ERROR', (done) => {
        const wrongData = {
            email: "test",
            firstName: data.firstName,
            lastName: data.lastName,
            userName: data.userName,
        };
        request(app)
            .put('/api/private/user/' + data.userName)
            .set('Authorization', token)
            .send(wrongData)
            .expect(422, done);
    });
    it('should return 422 ERROR', (done) => {
        const wrongData = {
            email: data.email,
            firstName: data.firstName,
            lastName: "q",
            userName: data.userName,
        };
        request(app)
            .put('/api/private/user/' + data.userName)
            .set('Authorization', token)
            .send(wrongData)
            .expect(422, done);
    });
    it('should return 201 OK', (done) => {
        const rightData = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            userName: data.userName,
        };
        request(app)
            .put('/api/private/user/' + data.userName)
            .send(rightData)
            .set('Authorization', token)
            .expect(201, done);
    });
    it('should return 201 OK', (done) => {
        const rightData = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            userName: "newUserName",
        };
        request(app)
            .put('/api/private/user/' + data.userName)
            .send(rightData)
            .set('Authorization', token)
            .expect(201, done);
    });
    it('should return 409 ERROR', (done) => {
        const wrongData = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            userName: otherData.userName,
        };
        request(app)
            .put('/api/private/user/' + data.userName)
            .send(wrongData)
            .set('Authorization', token)
            .expect(409, done);
    });
});
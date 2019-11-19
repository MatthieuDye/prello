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

const userForGet = {
    firstName: 'userForGet',
    lastName: 'userForGet',
    userName: 'userForGet',
    email: 'userForGet@user.fr',
    password: 'azerty',
    password2: 'azerty',
}
let userForGetId;

const boardData = {
    name: "hkhkjhkjh",
    description: "board description",
    userId: "",
    id:""
};


let token = null;

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

describe('GET /api/private/user/:userId', () => {


    before((done) => {
        boardData.userId = userForGetId;
        request(app)
            .post('/api/public/register')
            .send(userForGet)
            .then((res) => {
                userForGetId = res.body.user._id;
                done()
            })
    })
    it('should return 401 ERROR', (done) => {
        request(app)
            .get('/api/private/user/' + userForGetId)
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 404 ERROR', (done) => {
        request(app)
            .get('/api/private/user/000000000000000000000000')
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
    it('should return 422 ERROR', (done) => {
        request(app)
            .get('/api/private/user/666')
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
    it('should return 201 OK', (done) => {
        request(app)
            .get('/api/private/user/' + userForGetId)
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.user).to.not.be.undefined;
                expect(res.body.user.userName).equals(userForGet.userName);
                done();
            });
    });
});

describe('GET /api/private/user/findByBeginName/:query', () => {
    it('should return 401 ERROR', (done) => {
        request(app)
            .get('/api/private/user/findByBeginName/oui')
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 201 OK', (done) => {

        request(app)
            .get('/api/private/user/findByBeginName/newUser')
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                console.log("users : " + res.body.users);
                expect(res.body.users.length === 1);
                done();
            })
    });
});
describe('PUT /api/private/user/:userId/board/favorite/:boardId', () => {
    before((done) => {
        request(app)
            .post('/api/private/board/create')
            .send(boardData)
            .set('Authorization', token)
            .then((res) => {
                boardData.id = res.body.board._id;
                done()
            })
    });
    it('should return 401 ERROR', (done) => {
        request(app)
            .put(`/api/private/user/${userForGetId}/board/favorite/${boardData.id}`)
            .send({isFavorite: true})
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
    it('should return 201 OK', (done) => {
        request(app)
            .put(`/api/private/user/${userForGetId}/board/favorite/${boardData.id}`)
            .send({isFavorite: true})
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                console.log(res.body);
                expect(res.body.user.favoriteBoards).to.have.lengthOf(1);
                done();
            });
    });
});
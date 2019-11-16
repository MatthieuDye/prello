const request = require('supertest');
const {expect, assert} = require('chai');

//const app = process.env.SERVER_URI
const app = require("../server");
const User = require('../models/User');
const Board = require('../models/Board');

const boardData = {
    name: "hkhkjhkjh",
    description: "board description",
    userId: ""
};

const newBoard = {
    name: "board name",
    description: "board description",
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

describe('POST /board/create', () => {
    before((done) => {
        Promise.all([Board.deleteMany({}), User.deleteMany({})]).then(async () => {
            try {
                await request(app)
                    .post('/api/public/register')
                    .send(userData)
                    .then((res) => {
                        boardData.userId = res.body.user._id
                    });
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
            .post('/api/private/board/create')
            .send(boardData)
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(201, (err, res) => {
                expect(res.body.board).to.not.be.undefined
                .id = res.body.board._id;
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
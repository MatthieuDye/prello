/*const request = require('supertest');
const { expect, assert } = require('chai');

require('dotenv').config();
const app = process.env.SERVER_URI
const User = require('../models/User');

const data = {
    firstName: 'test',
    lastName: 'user',
    userName: 'testUser',
    email: 'test@user.fr',
    password: 'testpsw',
    password2: 'testpsw',
};

describe('POST /api/public/register', () => {
    before(async () => {
        //await User.deleteMany({});
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
            lastName: data.firstName,
            userName: data.firstName,
            password2: data.firstName
        };
        request(app)
            .post('/api/public/register')
            .send(wrongData)
            .expect('Content-Type', /json/)
            .expect(422, done);
    });
});*/
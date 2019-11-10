let request = require('supertest');
let chai = require('chai');
let mongoose = require('mongoose');
let should = chai.should();

module.exports = function (app, options) {

    describe('POST /api/team/creation', function () {

        it('should send back a CREATED response - Team creation', function (done) {
            request(app)
                .post('/api/team/creation')
                .set('Authorization', 'Bearer ' + options.token)
                .set('Content-Type', 'application/json')
                .send({
                    name: "test team 34560",
                    description: "description",
                    userId: "5dbef8aa222311218c5141d1"
                })
                .expect(201)
                .end(function (err, res) {
                    if (err) return done(err);
                    res.body.team.name.should.equal("test team 3456");
                    res.body.members.should.be.instanceof(Array).and.have.length(1);
                    options.board = res.body;
                    done();
                });
        });
    });
};
// LIST API TESTS

let request = require('supertest');
let chai = require('chai')
let mongoose = require('mongoose');
let should = chai.should();


module.exports = function (app, options) {

    describe('LIST API TEST', function () {

        describe('GET /api/lists/:id - Get a list by id', function () {

            it('should send back a OK response - Member can see the card with his/her rights', function (done) {
                request(app)
                    .get('/api/lists/' + options.list._id)
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a FORBIDDEN response - Member can\'t see the card with his/her rights', function (done) {
                request(app)
                    .get('/api/lists/' + options.list._id)
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .expect(403)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a OK response - Member can closed the list with his/her rights', function (done) {
                request(app)
                    .put('/api/lists/' + options.list._id +'/closed?value=false')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        request(app)
                            .get('/api/lists/' + options.list._id)
                            .set('Authorization', 'Bearer ' + options.token)
                            .set('Content-Type', 'application/json')
                            .expect(200)
                            .end(function (err, res) {
                                if (err) return done(err);
                                res.body.closed.should.be.equal(false);
                                done();
                            });
                    });
            });

            it('should send back a OK response - Member can open the list with his/her rights', function (done) {
                request(app)
                    .put('/api/lists/' + options.list._id +'/closed?value=true')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        request(app)
                            .get('/api/lists/' + options.list._id)
                            .set('Authorization', 'Bearer ' + options.token)
                            .set('Content-Type', 'application/json')
                            .expect(200)
                            .end(function (err, res) {
                                if (err) return done(err);
                                res.body.closed.should.be.equal(true);
                                done();
                            });
                    });
            });

            it('should send back a FORBIDDEN response - Member can\'t closed / open the list with his/her rights', function (done) {
                request(app)
                    .put('/api/lists/' + options.list._id +'/closed?value=false')
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .expect(403)
                    .end(function (err, res) {
                        if (err) return done(err);
                        request(app)
                            .get('/api/lists/' + options.list._id)
                            .set('Authorization', 'Bearer ' + options.token)
                            .set('Content-Type', 'application/json')
                            .expect(200)
                            .end(function (err, res) {
                                if (err) return done(err);
                                res.body.closed.should.be.equal(true);
                                done();
                            });
                    });
            });



        });
    });
}
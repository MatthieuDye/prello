// LABEL API TESTS

let request = require('supertest');
let chai = require('chai')
let mongoose = require('mongoose');
let should = chai.should();


module.exports = function (app, options) {

    describe('LABEL API TEST', function () {

        describe('GET /api/labels/:id - Get a label by id', function () {

            it('should send back a OK response - Label got', function (done) {

                request(app)
                    .get('/api/labels/' + options.label._id)
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a FORBIDDEN response - Label got by unauthorized member', function (done) {

                request(app)
                    .get('/api/labels/' + options.label._id)
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .expect(403)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });
        });

        describe('PUT /api/labels/:id - Update a label by id', function () {

            it('should send back a OK response - Name updated', function (done) {

                request(app)
                    .put('/api/labels/' + options.label._id + '?name=newName')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.name.should.be.equals('newName');
                        done();
                    });
            });

            it('should send back a OK response - Color updated', function (done) {

                request(app)
                    .put('/api/labels/' + options.label._id + '?color=%23213456')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.color.should.be.equals('#213456');
                        done();
                    });
            });

            it('should send back a OK response - Color updated by freind', function (done) {

                request(app)
                    .put('/api/labels/' + options.label._id + '?color=%23000000')
                    .set('Authorization', 'Bearer ' + options.tokenFreinds)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.color.should.be.equals('#000000');
                        done();
                    });
            });

            it('should send back a FORBIDDEN response - Color and name updated by unauthorized member', function (done) {

                request(app)
                    .put('/api/labels/' + options.label._id + '?color=%23213456&name=Hack')
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .expect(403)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });
        });

        describe('PUT /api/labels/:id - Update a label by id', function () {

            it('should send back a FORBIDDEN response - Deleted by unauthorized member', function (done) {

                request(app)
                    .delete('/api/labels/' + options.label._id)
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .expect(403)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });


            it('should send back a OK response - Deleted by freinds', function (done) {

                request(app)
                    .delete('/api/labels/' + options.label._id)
                    .set('Authorization', 'Bearer ' + options.tokenFreinds)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        request(app)
                            .get('/api/labels/' + options.label._id)
                            .set('Authorization', 'Bearer ' + options.token)
                            .set('Content-Type', 'application/json')
                            .expect(404)
                            .end(function (err, res) {
                                if (err) return done(err);
                                done();
                            });
                    });
            });
        });
    });
}
// BOARD API TESTS

let request = require('supertest');
let chai = require('chai')
let mongoose = require('mongoose');
let should = chai.should();


module.exports = function (app, options) {

    describe('BOARD API TEST', function () {

        describe('POST /api/boards - Board creation', function () {

            it('should send back a CREATED response - Board creation', function (done) {
                request(app)
                    .post('/api/boards')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .send({
                        name: "BoardName",
                        prefs: {
                            background: "#000000"
                        }
                    })
                    .expect(201)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.name.should.equal("BoardName");
                        res.body.prefs.background.should.equal("#000000");
                        res.body.memberships.should.be.instanceof(Array).and.have.length(1);
                        options.board = res.body;
                        done();
                    });
            });

            it('should send back a CREATED response - Board creation', function (done) {
                request(app)
                    .post('/api/boards')
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .send({
                        name: "BoardName",
                        prefs: {
                            background: "#000000"
                        }
                    })
                    .expect(201)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.name.should.equal("BoardName");
                        res.body.prefs.background.should.equal("#000000");
                        res.body.memberships.should.be.instanceof(Array).and.have.length(1);
                        options.memberUnauthorized.board = res.body;
                        done();
                    });
            });


            it('should send back a UNAUTHORIZED response - Board creation with no valid token', function (done) {
                request(app)
                    .post('/api/boards')
                    .set('Content-Type', 'application/json')
                    .send({
                        name: "BoardName",
                        color: "#000000"
                    })
                    .expect(401)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a BAD REQUEST response - Board creation with no name', function (done) {
                request(app)
                    .post('/api/boards')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .send({
                        name: ""
                    })
                    .expect(400)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a BAD REQUEST response - Board creation with invalid color format', function (done) {
                request(app)
                    .post('/api/boards')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .send({
                        name: "BoardName",
                        prefs: {
                            background : "#00000"
                        }
                    })
                    .expect(400)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

        });

        describe('GET /api/boards/:id - Board read', function () {

            it('should send back a OK response - Board got', function (done) {
                request(app)
                    .get('/api/boards/' + options.board._id)
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.name.should.equal("BoardName");
                        res.body.prefs.background.should.equal("#000000");
                        res.body.memberships.should.be.instanceof(Array).and.have.length(1);
                        done();
                    });
            });

            it('should send back a NOT_FOUND response - Wrong board id', function (done) {
                request(app)
                    .get('/api/boards/' + 'wR0ngB04rd1D')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a UNAUTHORIZED response - Wrong token', function (done) {
                request(app)
                    .get('/api/boards/' + 'wR0ngB04rd1D')
                    .set('Authorization', 'Bearer ' + '56s4dvsd68v6dsv7ds8v419d6fs8v4sd')
                    .set('Content-Type', 'application/json')
                    .expect(401)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

        });

        describe('PUT /api/boards/:id - Board read', function () {

            it('should send back a OK response - Board name updated', function (done) {
                request(app)
                    .put('/api/boards/' + options.board._id + '?name=BoardNameUpdated')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        request(app)
                            .get('/api/boards/' + options.board._id)
                            .set('Authorization', 'Bearer ' + options.token)
                            .set('Content-Type', 'application/json')
                            .expect(200)
                            .end(function (err, res) {
                                if (err) return done(err);
                                res.body.name.should.equal("BoardNameUpdated");
                                done();
                            });
                    });
            });

            it('should send back a OK response - Board closed updated', function (done) {
                request(app)
                    .put('/api/boards/' + options.board._id + '?closed=true')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        request(app)
                            .get('/api/boards/' + options.board._id)
                            .set('Authorization', 'Bearer ' + options.token)
                            .set('Content-Type', 'application/json')
                            .expect(200)
                            .end(function (err, res) {
                                if (err) return done(err);
                                res.body.closed.should.equal(true);
                                done();
                            });
                    });
            });

            it('should send back a OK response - Board desc updated', function (done) {
                request(app)
                    .put('/api/boards/' + options.board._id + '?desc=A new board to create amazing things')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        request(app)
                            .get('/api/boards/' + options.board._id)
                            .set('Authorization', 'Bearer ' + options.token)
                            .set('Content-Type', 'application/json')
                            .expect(200)
                            .end(function (err, res) {
                                if (err) return done(err);
                                res.body.desc.should.equal('A new board to create amazing things');
                                done();
                            });
                    });
            });
        });

        describe('PUT /api/boards/:id/members/:idMember - Board add member', function () {

            it('should send back a OK response - Freind member added', function (done) {
                request(app)
                    .put('/api/boards/' + options.board._id + '/members/' + options.memberFreinds._id + '?type=normal')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        options.membership = res.body;
                        request(app)
                            .get('/api/boards/' + options.board._id)
                            .set('Authorization', 'Bearer ' + options.token)
                            .set('Content-Type', 'application/json')
                            .expect(200)
                            .end(function (err, res) {
                                if (err) return done(err);
                                res.body.memberships.should.be.instanceof(Array).and.have.length(2);
                                request(app)
                                    .get('/api/members/' + options.memberFreinds._id)
                                    .set('Authorization', 'Bearer ' + options.tokenFreinds)
                                    .set('Content-Type', 'application/json')
                                    .expect(200)
                                    .end(function (err, res) {
                                        res.body.idBoards.should.be.instanceof(Array).and.have.length(1);
                                        if (err) return done(err);
                                        done();
                                    });
                            });
                    });
            });

            it('should send back a OK response - Add a member that already exis in the board but not added a second time', function (done) {
                request(app)
                    .put('/api/boards/' + options.board._id + '/members/' + options.memberFreinds._id + '?type=normal')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        request(app)
                            .get('/api/boards/' + options.board._id)
                            .set('Authorization', 'Bearer ' + options.token)
                            .set('Content-Type', 'application/json')
                            .expect(200)
                            .end(function (err, res) {
                                if (err) return done(err);
                                res.body.memberships.should.be.instanceof(Array).and.have.length(2);
                                request(app)
                                    .get('/api/members/' + options.memberFreinds._id)
                                    .set('Authorization', 'Bearer ' + options.tokenFreinds)
                                    .set('Content-Type', 'application/json')
                                    .expect(200)
                                    .end(function (err, res) {
                                        res.body.idBoards.should.be.instanceof(Array).and.have.length(1);
                                        if (err) return done(err);
                                        done();
                                    });
                            });
                    });
            });

            it('should send back a FORBIDDEN response - Friend add itself with admin rights', function (done) {
                request(app)
                    .put('/api/boards/' + options.board._id + '/members/' + options.memberFreinds._id + '?type=admin')
                    .set('Authorization', 'Bearer ' + options.tokenFreinds)
                    .set('Content-Type', 'application/json')
                    .expect(403)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a FORBIDDEN response - Administrator downgrade his rights (1 admin on the board)', function (done) {
                request(app)
                    .put('/api/boards/' + options.board._id + '/members/' + options.member._id + '?type=normal')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(403)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a OK response - Member up admin right to  member added', function (done) {
                request(app)
                    .put('/api/boards/' + options.board._id + '/members/' + options.memberFreinds._id + '?type=admin')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

        });

        describe('GET /api/boards/:id/members - Board memberships', function () {

            it('should send back a OK response - Board\'s members got', function (done) {
                request(app)
                    .get('/api/boards/' + options.board._id + '/members')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.should.be.instanceof(Array).and.have.length(2);
                        res.body[0].memberType.should.be.equals('admin');
                        res.body[0].idMember.username.should.be.equals(options.member.username);
                        done();
                    });
            });


            it('should send back a FORBIDDEN response - Board\'s members get by member without access', function (done) {
                request(app)
                    .get('/api/boards/' + options.board._id + '/members')
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .expect(403)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a NOT FOUND response - Board\'s members with wing id', function (done) {
                request(app)
                    .get('/api/boards/78' + options.board._id + '/members')
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a UNAUTHORIZED response - Board\'s members without token', function (done) {
                request(app)
                    .get('/api/boards/' + options.board._id + '/members')
                    .set('Content-Type', 'application/json')
                    .expect(401)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });
        });

        describe('DELETE /api/boards/:id/members/:idMemberShip - delete a membership', function () {

            it('should send back a FORBIDDEN response - Board\'s members deleted by not a admin', function (done) {
                request(app)
                    .delete('/api/boards/' + options.board._id + '/members/' + options.membership._id)
                    .set('Authorization', 'Bearer ' + options.tokenFreinds)
                    .set('Content-Type', 'application/json')
                    .expect(403)
                    .end(function (err, res) {
                        done();
                    });
            });

            it('should send back a OK response - Board\'s members deleted by an admin', function (done) {
                request(app)
                    .delete('/api/boards/' + options.board._id + '/members/' + options.membership._id)
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        request(app)
                            .get('/api/boards/' + options.board._id)
                            .set('Authorization', 'Bearer ' + options.token)
                            .set('Content-Type', 'application/json')
                            .expect(200)
                            .end(function (err, res) {
                                if (err) return done(err);
                                res.body.memberships.should.be.instanceof(Array).and.have.length(1);
                                request(app)
                                    .put('/api/boards/' + options.board._id + '/members/' + options.memberFreinds._id + '?type=normal')
                                    .set('Authorization', 'Bearer ' + options.token)
                                    .set('Content-Type', 'application/json')
                                    .expect(200)
                                    .end(function (err, res) {
                                        if (err) return done(err);
                                        options.membership = res.body;
                                        done();
                                    });
                            });
                    });
            });

        });

        describe('POST /api/boards/:id/lists - Create a list for the board', function () {

            it('should send back a CREATE response - List created', function (done) {
                request(app)
                    .post('/api/boards/' + options.board._id + '/lists')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .send({
                        name: "ListName",
                        pos : 123
                    })
                    .expect(201)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.name.should.equal("ListName");
                        res.body.pos.should.equal(123);
                        res.body.idBoard.should.be.equal(options.board._id);
                        options.list = res.body;
                        done();
                    });
            });

            it('should send back a CREATE response - List created', function (done) {
                request(app)
                    .post('/api/boards/' + options.memberUnauthorized.board._id + '/lists')
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .send({
                        name: "ListName",
                        pos : 123
                    })
                    .expect(201)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.name.should.equal("ListName");
                        res.body.pos.should.equal(123);
                        res.body.idBoard.should.be.equal(options.memberUnauthorized.board._id);
                        options.memberUnauthorized.list = res.body;
                        done();
                    });
            });

            it('should send back a UNAUTHORIZED response - List created with unauthorized user', function (done) {
                request(app)
                    .post('/api/boards/' + options.board._id + '/lists')
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .send({
                        name: "ListName",
                        pos : 123
                    })
                    .expect(403)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a CREATE response - Send with additional fake field, the created object don\'t have it', function (done) {
                request(app)
                    .post('/api/boards/' + options.board._id + '/lists')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .send({
                        name: "ListName2",
                        pos : 123,
                        idBoard: 'toto',
                        foo: 'bar'
                    })
                    .expect(201)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.name.should.equal("ListName2");
                        res.body.pos.should.equal(123);
                        res.body.should.not.have.property('foo');
                        res.body.should.have.property('name');
                        res.body.idBoard.should.be.equal(options.board._id);
                        done();
                    });
            });

            it('should send back a BAD REQUEST response - Name missing', function (done) {
                request(app)
                    .post('/api/boards/' + options.board._id + '/lists')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .send({
                        pos : 123
                    })
                    .expect(400)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a BAD REQUEST response - pos missing', function (done) {
                request(app)
                    .post('/api/boards/' + options.board._id + '/lists')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .send({
                        name : "ListName3"
                    })
                    .expect(400)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a CREATE response - List created by another member of the board', function (done) {
                request(app)
                    .post('/api/boards/' + options.board._id + '/lists')
                    .set('Authorization', 'Bearer ' + options.tokenFreinds)
                    .set('Content-Type', 'application/json')
                    .send({
                        name: "ListName4",
                        pos : 123
                    })
                    .expect(201)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

        });


        describe('GET /api/boards/:id/lists - GET lists for the board', function () {

            it('should send back a OK response - Lists got', function (done) {
                request(app)
                    .get('/api/boards/' + options.board._id + '/lists')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.should.be.instanceof(Array).and.have.length(3);
                        done();
                    });
            });

            it('should send back a FORBIDDEN response - Invalid user want get the board', function (done) {
                request(app)
                    .get('/api/boards/' + options.board._id + '/lists')
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .expect(403)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a OK response -  lists for the board with name "ListName"', function (done) {
                request(app)
                    .get('/api/boards/' + options.board._id + '/lists?name=ListName')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.should.be.instanceof(Array).and.have.length(1);
                        done();
                    });
            });

        });

        describe('POST /api/boards/:id/labels - Create a label on a board', function () {

            it('should send back a CREATE response - Label created', function (done) {
                request(app)
                    .post('/api/boards/' + options.board._id + '/labels?name=myLabel&color=%23000000')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.name.should.be.equals("myLabel");
                        res.body.color.should.be.equals("#000000");
                        options.label = res.body;
                        done();
                    });
            });

            it('should send back a CREATE response - Label created', function (done) {
                request(app)
                    .post('/api/boards/' + options.memberUnauthorized.board._id + '/labels?name=myLabelTwo&color=%23000000')
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.name.should.be.equals("myLabelTwo");
                        res.body.color.should.be.equals("#000000");
                        options.memberUnauthorized.label = res.body;
                        done();
                    });
            });

            it('should send back a BAD REQUEST response - Label created with no name', function (done) {
                request(app)
                    .post('/api/boards/' + options.board._id + '/labels?name=&color=%23000000')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a BAD REQUEST response - Label created with no color', function (done) {
                request(app)
                    .post('/api/boards/' + options.board._id + '/labels?name=&color=')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a FORBIDDEN response - Label created by unauthorized member', function (done) {
                request(app)
                    .post('/api/boards/' + options.board._id + '/labels?name=myLabel&color=%23000000')
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .expect(403)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

        });

    });

}
// BOARD API TESTS

let request = require('supertest');
let chai = require('chai')
let mongoose = require('mongoose');
let should = chai.should();


module.exports = function (app, options) {

    describe('CARD API TEST', function () {

        describe('POST /api/cards - Board creation', function () {

            it('should send back a CREATED response - Card created', function (done) {
                request(app)
                    .post('/api/cards')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .send({
                        "idList" : options.list._id,
                        "idBoard" : options.list.idBoard,
                        "pos" : 123456789
                    })
                    .expect(201)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.pos.should.equal(123456789);
                        res.body.idList.should.equal(options.list._id);
                        options.card = res.body;
                        done();
                    });
            });

            it('should send back a CREATED response - Card created', function (done) {
                request(app)
                    .post('/api/cards')
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .send({
                        "idList" : options.memberUnauthorized.list._id,
                        "idBoard" : options.memberUnauthorized.list.idBoard,
                        "pos" : 123456789
                    })
                    .expect(201)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.pos.should.equal(123456789);
                        res.body.idList.should.equal(options.memberUnauthorized.list._id);
                        options.memberUnauthorized.card = res.body;
                        done();
                    });
            });

            it('should send back a CREATED response - Card created by another member', function (done) {
                request(app)
                    .post('/api/cards')
                    .set('Authorization', 'Bearer ' + options.tokenFreinds)
                    .set('Content-Type', 'application/json')
                    .send({
                        "idList" : options.list._id,
                        "idBoard" : options.list.idBoard,
                        "pos" : 123456789,
                        "name" : "a another card"
                    })
                    .expect(201)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a FORBIDDEN response - Card created with wrong access', function (done) {
                request(app)
                    .post('/api/cards')
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .send({
                        "idList" : options.list._id,
                        "idBoard" : options.list.idBoard,
                        "pos" : 123456789
                    })
                    .expect(403)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

        });

        describe('POST /api/cards/:id/idMembers/ - Attach a member to the card', function () {

            it('should send back a OK response - Attach a authorized user to the board', function (done) {
                request(app)
                    .post('/api/cards/'+ options.card._id +'/idMembers?value='+options.board.memberships[0]._id)
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a FORBIDDEN response - Attach a unauthorized user to the board', function (done) {
                request(app)
                    .post('/api/cards/'+ options.card._id +'/idMembers?value='+options.memberUnauthorized._id)
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .send({
                        "idList": options.list._id,
                        "pos": 123456789
                    })
                    .expect(403)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });
        });

        describe('DELETE /api/cards/:id/idMembers/:id - Remove a member to the card', function () {

            it('should send back a OK response - Attach a authorized user to the board', function (done) {
                request(app)
                    .delete('/api/cards/' + options.card._id + '/idMembers/' + options.board.memberships[0]._id)
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });
        });

        describe('GET /api/boards/:id/lists?cards=open - Get lists of the board with cards', function () {

            it('should send back a OK response - Lists with cards successfully got', function (done) {
                request(app)
                    .get('/api/boards/' + options.board._id + '/lists?cards=open')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.should.be.instanceof(Array).and.have.length(3);
                        res.body[0].cards.should.exist.and.be.instanceof(Array).and.have.length(2);
                        done();
                    });
            });
            it('should send back a OK response - Lists without cards successfully got', function (done) {
                request(app)
                    .get('/api/boards/' + options.board._id + '/lists')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.should.be.instanceof(Array).and.have.length(3);
                        (res.body[0].cards === null).should.be.true;
                        done();
                    });
            });

        });

        describe('POST /api/cards/:id/checklists - Create a checklist for the card', function () {

            it('should send back a CREATE response - Checklist created successfully', function (done) {
                request(app)
                    .post('/api/cards/' + options.card._id + '/checklists')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .send({
                        "pos": 123456789,
                        "name": "MyCheckList"
                    })
                    .expect(201)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.name.should.be.equals("MyCheckList");
                        res.body.idCard.should.be.equals( options.card._id );
                        res.body.pos.should.be.equals(123456789);
                        res.body.idBoard.should.be.equals( options.card.idBoard);
                        options.checklist = res.body;
                        done();
                    });
            });

            it('should send back a CREATE response - Checklist created successfully by a another member', function (done) {
                request(app)
                    .post('/api/cards/' + options.card._id + '/checklists')
                    .set('Authorization', 'Bearer ' + options.tokenFreinds)
                    .set('Content-Type', 'application/json')
                    .send({
                        "pos": 123456789,
                        "name": "MyCheckList"
                    })
                    .expect(201)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.name.should.be.equals("MyCheckList");
                        res.body.idCard.should.be.equals( options.card._id );
                        res.body.pos.should.be.equals(123456789);
                        res.body.idBoard.should.be.equals( options.card.idBoard);
                        done();
                    });
            });

            it('should send back a BAD REQUEST response - Name or pos missing', function (done) {
                request(app)
                    .post('/api/cards/' + options.card._id + '/checklists')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .send({
                        "idBoard": options.card.idBoard,
                        "pos": 123456789
                    })
                    .expect(400)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a NOT FOUND response - Invalid card ID', function (done) {
                request(app)
                    .post('/api/cards/' + options.card._id + '78/checklists')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .send({
                        "idBoard": options.card.idBoard,
                        "pos": 123456789
                    })
                    .expect(404)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a FORBIDDEN response - Checklist created by a unauthorized member', function (done) {
                request(app)
                    .post('/api/cards/' + options.card._id + '/checklists')
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .send({
                        "pos": 123456789,
                        "name": "MyCheckList"
                    })
                    .expect(403)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a UNAUTHORIZED response - No token given', function (done) {
                request(app)
                    .post('/api/cards/' + options.card._id + '/checklists')
                    .set('Content-Type', 'application/json')
                    .send({
                        "idBoard": options.card.idBoard,
                        "pos": 123456789
                    })
                    .expect(401)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

        });

        describe('GET /api/cards/:id/checklists - Get all checklists for the card', function () {

            it('should send back a OK response - Checklist got successfully', function (done) {
                request(app)
                    .get('/api/cards/' + options.card._id + '/checklists')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.should.be.instanceof(Array).and.have.length(2);
                        done();
                    });
            });

            it('should send back a OK response - Checklist got successfully by another member', function (done) {
                request(app)
                    .get('/api/cards/' + options.card._id + '/checklists')
                    .set('Authorization', 'Bearer ' + options.tokenFreinds)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.should.be.instanceof(Array).and.have.length(2);
                        done();
                    });
            });

            it('should send back a FORBIDDEN response - Checklist get by unauthorized member', function (done) {
                request(app)
                    .get('/api/cards/' + options.card._id + '/checklists')
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .expect(403)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a UNAUTHORIZED response - Checklist got by unauthenticated user', function (done) {
                request(app)
                    .get('/api/cards/' + options.card._id + '/checklists')
                    .set('Content-Type', 'application/json')
                    .expect(401)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a NOT FOUND response - Checklist got by unauthenticated user', function (done) {
                request(app)
                    .get('/api/cards/' + options.card._id + '45/checklists')
                    .set('Authorization', 'Bearer ' + options.tokenFreinds)
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });
        });

        describe('POST /api/cards/:id/idLabels - Associate a label to a card', function () {

            it('should send back a CREATED response - Label linked at the card', function (done) {
                request(app)
                    .post('/api/cards/' + options.card._id + '/idLabels?value=' + options.label._id)
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .end(function (err, res) {
                        if (err) return done(err);
                        request(app)
                            .get('/api/cards/'+ options.card._id)
                            .set('Authorization', 'Bearer ' + options.token)
                            .set('Content-Type', 'application/json')
                            .expect(200)
                            .end(function (err, res) {
                                if (err) return done(err);
                                res.body.idLabels.should.be.instanceof(Array).and.have.length(1);
                                done();
                            });
                    });
            });

            it('should send back a BAD REQUEST response - Label on other board linked at the card', function (done) {
                request(app)
                    .post('/api/cards/' + options.card._id + '/idLabels?value=' + options.memberUnauthorized.label._id)
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a BAD REQUEST response - Label linked at the card of other board', function (done) {
                request(app)
                    .post('/api/cards/' + options.memberUnauthorized.card._id + '/idLabels?value=' + options.label._id)
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });
        });

        describe('DELETE /api/cards/:id/idLabels/:idLabels - Delete a label to a card', function () {

            it('should send back a NOT FOUND response - Label not exist', function (done) {
                request(app)
                    .delete('/api/cards/' + options.card._id + '/idLabels/78' + options.label._id)
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a FORBIDDEN response - Label removed by another unauthorized member', function (done) {
                request(app)
                    .delete('/api/cards/' + options.card._id + '/idLabels/' + options.label._id)
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .expect(403)
                    .end(function (err, res) {
                        if (err) return done(err);
                        request(app)
                            .get('/api/cards/' + options.card._id)
                            .set('Authorization', 'Bearer ' + options.token)
                            .set('Content-Type', 'application/json')
                            .expect(200)
                            .end(function (err, res) {
                                if (err) return done(err);
                                res.body.idLabels.should.be.instanceof(Array).and.have.length(1);
                                done();
                            });
                    });
            });

            it('should send back a OK response - Label removed to the card', function (done) {
                request(app)
                    .delete('/api/cards/' + options.card._id + '/idLabels/' + options.label._id)
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        request(app)
                            .get('/api/cards/' + options.card._id)
                            .set('Authorization', 'Bearer ' + options.token)
                            .set('Content-Type', 'application/json')
                            .expect(200)
                            .end(function (err, res) {
                                if (err) return done(err);
                                res.body.idLabels.should.be.instanceof(Array).and.have.length(0);
                                done();
                            });
                    });
            });

        });

        describe('POST /api/cards/:id/comments - Create a comment', function () {

            it('should send back a CREATED response - Comment created by authorized member', function (done) {
                request(app)
                    .post('/api/cards/' + options.card._id + '/comments')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .send({
                        text: "A new comment on a card"
                    })
                    .expect(201)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.text.should.be.equals("A new comment on a card");
                        res.body.idCard.should.be.equals(options.card._id);
                        res.body.idAuthor.id.should.be.equals(options.member._id);
                        options.comment = res.body;
                        done();
                    });
            });

            it('should send back a BAD REQUEST response - Comment without text', function (done) {
                request(app)
                    .post('/api/cards/' + options.card._id + '/comments')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .send({})
                    .expect(400)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a CREATED response - Comment created by authorized member', function (done) {
                request(app)
                    .post('/api/cards/' + options.card._id + '/comments')
                    .set('Authorization', 'Bearer ' + options.tokenFreinds)
                    .set('Content-Type', 'application/json')
                    .send({
                        text: "A other new comment on a card"
                    })
                    .expect(201)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.text.should.be.equals("A other new comment on a card");
                        res.body.idCard.should.be.equals(options.card._id);
                        res.body.idAuthor.id.should.be.equals(options.memberFreinds._id);
                        done();
                    });
            });

            it('should send back a FORBIDDEN response - Comment created by unauthorized member', function (done) {
                request(app)
                    .post('/api/cards/' + options.card._id + '/comments')
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .send({
                        text: "A other new comment on a card"
                    })
                    .expect(403)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });
        });

        describe('GET /api/cards/:id/comments - Get comments on a card', function () {

            it('should send back a OK response - Comments got', function (done) {
                request(app)
                    .get('/api/cards/' + options.card._id + '/comments')
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.should.be.instanceof(Array).and.have.length(2);
                        done();
                    });
            });

            it('should send back a OK response - Comments got by another member of the board', function (done) {
                request(app)
                    .get('/api/cards/' + options.card._id + '/comments')
                    .set('Authorization', 'Bearer ' + options.tokenFreinds)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        res.body.should.be.instanceof(Array).and.have.length(2);
                        done();
                    });
            });

            it('should send back a OK response - Comments got by unauthorized member', function (done) {
                request(app)
                    .get('/api/cards/' + options.card._id + '/comments')
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .expect(403)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });
        });

        describe('DELETE /api/cards/:id/comments/:idComment - Get comments on a card', function () {

            it('should send back a FORBIDDEN response - Comment deleted by a member that is not the author', function (done) {
                request(app)
                    .delete('/api/cards/' + options.card._id + '/comments/' + options.comment.id)
                    .set('Authorization', 'Bearer ' + options.tokenFreinds)
                    .set('Content-Type', 'application/json')
                    .expect(403)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a FORBIDDEN response - Comment deleted by a member that is not the author', function (done) {
                request(app)
                    .delete('/api/cards/' + options.card._id + '/comments/' + options.comment.id)
                    .set('Authorization', 'Bearer ' + options.tokenUnauthorized)
                    .set('Content-Type', 'application/json')
                    .expect(403)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            });

            it('should send back a FORBIDDEN response - Comment deleted by a member that is not the author', function (done) {
                request(app)
                    .delete('/api/cards/' + options.card._id + '/comments/' + options.comment.id)
                    .set('Authorization', 'Bearer ' + options.token)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        request(app)
                            .get('/api/cards/' + options.card._id + '/comments')
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
        });


    });
}
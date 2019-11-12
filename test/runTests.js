var expect  = require('chai').expect;
var request = require('request');
const app = 'http://localhost:5000'

it('Main page content', function(done) {
    request(app, function(error, response, body) {
        expect(body).to.equal('Hello World');
        done();
    });
});


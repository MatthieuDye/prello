var expect  = require('chai').expect;
var request = require('request');
require('dotenv').config();
const app = process.env.SERVER_URI

it('Main page content', function(done) {
    request(app, function(error, response, body) {
        expect(body).to.equal('Hello World');
        done();
    });
});
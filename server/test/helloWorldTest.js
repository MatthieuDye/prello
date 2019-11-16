/*var expect  = require('chai').expect;
var request = require('request');
require('dotenv').config();
const app = process.env.SERVER_URI

it('Main page content', function(done) {
    request(app, function(error, response, body) {
        expect(body).to.equal('Hello World');
        done();
    });
});*/

var assert = require('assert');
describe('1 + 1 = 2', function() {
    describe('addition', function() {
        it('adds numbers', function () {
            var result = 1+1;
            assert.equal(result, 2);
        });
    });
});
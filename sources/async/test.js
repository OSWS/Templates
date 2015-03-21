var async = require('../').async;
var assert = require('chai').assert;

describe('async', function() {
    it('manually', function(done) {
        async(function(context, callback) { callback(null, 123); }).__compile({}, function(error, result) {
            if (error) throw error;
            assert.equal(result, 123);
            done();
        });
    });
    it('.toString', function() {
        assert.equal(async(function(context, callback) { callback(null, 123); }).toString(), 123);
        assert.equal(String(async(function(context, callback) { callback(null, 123); })), 123);
    });
    it('compile', function(done) {
        async(function(context, callback) { callback(null, 123); }).compile(function(error, result) {
            if (error) throw error;
            assert.equal(result, 123);
            done();
        });
    });
});
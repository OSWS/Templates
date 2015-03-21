var sync = require('../').sync;
var assert = require('chai').assert;

describe('sync', function() {
    it('manually', function() {
        assert.equal(sync(function() { return 123; }).__compile({}, []), 123);
    });
    it('.toString', function() {
        assert.equal(sync(function() { return 123; }).toString(), 123);
        assert.equal(String(sync(function() { return 123; })), 123);
    });
    it('compile', function() {
        assert.equal(sync(function() { return 123; }).compile(), 123);
    });
});
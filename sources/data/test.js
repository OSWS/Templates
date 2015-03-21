var data = require('../').data;
var assert = require('chai').assert;

describe('data', function() {
    it('encapsulation', function() {
        var first = data(data(1), data(2), data(3));
        assert.equal(String(first.compile()), '123');
    });
});
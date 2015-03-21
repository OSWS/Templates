var data = require('../').data;
var assert = require('chai').assert;

describe('data', function() {
    it('encapsulation', function() {
        var first = data(data(1), data(2), data(3));
        assert.equal(String(first.compile()), '123');
    });
    it('inheritance', function() {
        var first = data(1, 2, 3);
        var second = first.extend()();
        assert.deepEqual(first._data, second._data);
        assert(first._data !== second._data);
    });
});
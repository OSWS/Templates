var mixin = require('../').mixin;
var assert = require('chai').assert;

describe('mixin', function() {
    it('default', function() {
        var mix = mixin(function(a, b, c) { return a+b+c; });
        assert.equal(String(mix(1,2,3)), 6);
    });
    it('null', function() {
        assert.equal(String(mixin()()), '');
    });
});
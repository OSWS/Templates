var Class = require('../').Class;
var __static = require('../').__static;
var assert = require('chai').assert;

describe('static', function() {
    it('one inheritor', function() {
        var Constructor = (new Class()).extend(function() {
            var prototype = this.___prototype;
            this.a = function() { return 123 };
            this.extend = function() {
                var extension = prototype.extend.apply(this, arguments);
                __static(extension, 'a');
                return extension;
            };
        })().extend();
        assert.equal(Constructor.a(), 123);
    });
    it('two inheritors', function() {
        var Constructor = (new Class()).extend(function() {
            this.a = function() { return 123 };
        })().extend(function() {
            var prototype = this.___prototype;
            this.extend = function() {
                var extension = prototype.extend.apply(this, arguments);
                __static(extension, 'a');
                return extension;
            };
        })().extend();
        assert.equal(Constructor.a(), 123);
    });
});
var compileAsync = require('../').compileAsync;
var sync = require('../').sync;
var Node = require('../').Node;
var assert = require('chai').assert;

describe('compile', function() {
    it('number', function(done) {
        compileAsync(123, {}, function(e, d) {
            if (e) throw e;
            assert.equal(d, 123);
            done();
        });
    });
    it('string', function(done) {
        compileAsync('123', {}, function(e, d) {
            if (e) throw e;
            assert.equal(d, '123');
            done();
        });
    });
    it('array', function(done) {
        compileAsync([1, '2', 3], {}, function(e, d) {
            if (e) throw e;
            assert.deepEqual(d, '123');
            done();
        });
    });
    it('object', function(done) {
        compileAsync({a: 1, b: '2', c: 3}, {}, function(e, d) {
            if (e) throw e;
            assert.deepEqual(d, '[object Object]');
            done();
        });
    });
    it('.context', function(done) {
        var first = Node().extend(function() {
            this.__compile = function(compilation) {
                return compilation.context(3);
            };
        })();
        first.context(function() {
            return 2;
        });
        first.compile(function(argument) {
            return [1, this.next(), argument];
        }, function(error, result) {
            if (error) throw error;
            assert.equal(result, '123');
            done();
        });
    });
});
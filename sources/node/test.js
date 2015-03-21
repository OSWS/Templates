var Node = require('../').Node;
var assert = require('chai').assert;

describe('node', function() {
    describe('.compile', function() {
        it('callback', function(done) {
            var first = Node().extend(function() {
                this.__compile = function() { return 'true'; };
            });
            first.compile(function(error, result) {
                if (error) throw error;
                assert.equal(result, 'true');
                done();
            });
        });
        it('return', function(done) {
            var first = Node().extend(function() {
                this.__compile = function() { return 'true'; };
            });
            var second = first.compile();
            second.__compile({}, function(error, result) {
                if (error) throw error;
                assert.equal(result, 'true');
                done();
            });
        });
    });
});
var Class = require('../').Class;
var assert = require('chai').assert;

describe('class', function() {
    
    // Not required new.
    it('[new]', function() {
        var first = new Class();
        var First = first.extend();
        var second = First();
        assert(second instanceof First);
        assert(second instanceof Class);
    });
    
    it('.__returner', function() {
        var first = new Class();
        var First = first.extend(function() {
            this.__constructor = function(data) {
                this._data = data;
            };
            this.__returner = function() { return this._data; };
        });
        var second = First(123);
        assert.equal(second, 123);
    });
    
    it('.___prototype', function() {
        var first = new Class();
        var First = first.extend();
        var second = First();
        assert(second.___prototype === first);
        var Second = second.extend();
        var third = Second();
        assert(third.___prototype === second);
        assert(third.___prototype !== first);
    });
    
    it('.___factory', function() {
        var first = new Class();
        var First = first.extend();
        var second = First();
        assert(second.___factory === First);
        var Second = second.extend();
        var third = Second();
        assert(third.___factory === Second);
        assert(third.___factory !== First);
    });
});
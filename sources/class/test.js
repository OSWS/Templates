describe('class', function() {
    
    // Not required new.
    it('[new]', function() {
        var first = new T.Class();
        var First = first.extend();
        var second = First();
        assert(second instanceof First);
        assert(second instanceof T.Class);
    });
    
    it('.___arguments', function() {
        var first = new T.Class();
        var second = first.extend()(1, 2, 3);
        assert(Object.prototype.toString.call(second.___arguments) == '[object Arguments]');
        assert.equal(second.___arguments[0], 1);
        assert.equal(second.___arguments[1], 2);
        assert.equal(second.___arguments[2], 3);
    });
    
    it('.__returner', function() {
        var first = new T.Class();
        var First = first.extend(function() {
            this.__returner = function() { return this.___arguments[0]; };
        });
        var second = First(123);
        assert.equal(second, 123);
    });
    
    it('.___prototype', function() {
        var first = new T.Class();
        var First = first.extend();
        var second = First();
        assert(second.___prototype === first);
        var Second = second.extend();
        var third = Second();
        assert(third.___prototype === second);
        assert(third.___prototype !== first);
    });
    
    it('.___factory', function() {
        var first = new T.Class();
        var First = first.extend();
        var second = First();
        assert(second.___factory === First);
        var Second = second.extend();
        var third = Second();
        assert(third.___factory === Second);
        assert(third.___factory !== First);
    });
});
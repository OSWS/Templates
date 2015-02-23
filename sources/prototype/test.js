describe('prototype', function() {
    it('[new]', function() {
        var p = new T.Prototype();
        var c = p.extend();
        var i = c();
        assert(i instanceof c);
    });
    it('._arguments', function() {
        var p = new T.Prototype();
        var i = p.extend()(1, 2, 3);
        assert(_.isArguments(i._arguments));
        assert.equal(i._arguments[0], 1);
        assert.equal(i._arguments[1], 2);
        assert.equal(i._arguments[2], 3);
    });
    it('.returner', function() {
        var p = new T.Prototype();
        var c = p.extend(function() {
            this.returner = function() {
                var _this = this;
                return function() { return _this; };
            };
        });
        var i = c(1, 2, 3)();
        assert(i instanceof c);
    });
    it('static', function() {
        var result = undefined;
        var p = new T.Prototype();
        var c = p.extend('test', function() {
            var parent = this._parent;
            
            this.test = function() { result = 123; };
        });
        c.test();
        assert.equal(result, 123);
    });
});
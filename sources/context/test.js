describe('context', function() {
    
    it('found', function(done) {
        var first = T.context('a', 'b');
        first.__compile({ a: { b: 123 }}, function(error, data) {
            if (error) throw error;
            assert.equal(data, 123);
            done();
        });
    });
    
    it('not found', function(done) {
        var first = T.context('a', 'b', 'c');
        first.__compile({ a: 123}, function(error, data) {
            assert(error);
            assert(!data);
            done();
        });
    });
    
    it('in compiler', function(done) {
        var first = T.Compiler.data([1, T.context('a', 'b'), 3]);
        first.__compile({ a: { b: 2 } }, function(error, data) {
            if (error) throw error;
            assert.deepEqual(data, [1, 2, 3]);
            done();
        });
    });
    
    it('TData', function(done) {
        var first = T.Compiler.data([1, T.context('a', 'b'), 3]);
        first.__compile({ a: { b: T.sync(function() { return 2; }) } }, function(error, data) {
            if (error) throw error;
            assert.deepEqual(data, [1, 2, 3]);
            done();
        });
    });
    
    it('function', function(done) {
        var first = T.Compiler.data([1, T.context('a', 'b')(2), 3]);
        first.__compile({ a: { b: function(c) { return c; } } }, function(error, data) {
            if (error) throw error;
            assert.deepEqual(data, [1, 2, 3]);
            done();
        });
    });
    
    it('functions', function(done) {
        var first = T.Compiler.data([1, T.context('a', 'b')(123)(456), 3]);
        first.__compile({ a: { b: function(c) { return function(d) { return c + d; }; } } }, function(error, data) {
            if (error) throw error;
            assert.deepEqual(data, [1, 123+456, 3]);
            done();
        });
    });
    
    it('data', function(done) {
        var d = T.data(T.context('a', 'b'), T.context('c')(456));
        d.compile({ a: { b: 123 }, c: function(d) { return d; } }, function(error, result) {
            if (error) throw error;
            assert.equal(result, 123456);
            done();
        });
    });
});
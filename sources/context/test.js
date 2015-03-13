describe('context', function() {
    
    it('found', function(done) {
        var first = T.context('a', 'b');
        first.compile({ a: { b: 123 }}, function(error, data) {
            if (error) throw error;
            assert.equal(data, 123);
            done();
        });
    });
    
    it('not found', function(done) {
        var first = T.context('a', 'b', 'c');
        first.compile({ a: 123 }, function(error, data) {
            assert(error);
            assert(!data);
            done();
        });
    });
    
    it('in compiler', function(done) {
        var first = T.Compiler.data([1, T.context('a', 'b'), 3]);
        first.compile({ a: { b: 2 } }, function(error, data) {
            if (error) throw error;
            assert.equal(data, 123);
            done();
        });
    });
    
    it('TData', function(done) {
        var first = T.Compiler.data([1, T.context('a', 'b'), 3]);
        first.compile({ a: { b: T.sync(function() { return 2; }) } }, function(error, data) {
            if (error) throw error;
            assert.equal(data, 123);
            done();
        });
    });
});
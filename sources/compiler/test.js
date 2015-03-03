describe('compiler', function() {
    
    it('.data.compile', function(done) {
        T.Compiler().data('123').compile({}, function(error, result) {
            if (error) throw error;
            assert.equal(result, '123');
            done();
        });
    });
    
    it('.context', function(done) {
        assert.deepEqual(T.Compiler().context({ a: { b: 1 } }).context({ a: { c: 2 } })._context, { a: { b: 1, c: 2 } });
        done();
    });
});
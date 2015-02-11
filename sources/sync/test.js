describe('sync', function() {
    it('function', function() {
        assert(is.function(T.sync(function() {})));
    });
    it('()', function() {
        assert.equal(T.sync(function() { return 123; })(), 123);
    });
    it('.toString', function() {
        assert.equal(T.sync(function() { return 123; }) + '', 123);
    });
});
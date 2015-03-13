describe('sync', function() {
    it('calling', function() {
        assert.equal(T.sync(function() { return 123; })(), 123);
    });
    it('.toString', function() {
        assert.equal(T.sync(function() { return 123; }).toString(), 123);
        assert.equal(String(T.sync(function() { return 123; })), 123);
        assert.equal(T.sync(function() { return 123; }) + '', 123);
        assert.equal(T.sync(function() { return 123; }), 123);
    });
});
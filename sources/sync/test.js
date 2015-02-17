describe('sync', function() {
    it('function', function() {
        assert(is.function(T.sync(function() {})));
    });
    it('calling', function() {
        assert.equal(T.sync(function() { return 123; })(), 123);
    });
    it('.toString', function() {
        assert.equal(T.sync(function() { return 123; }).toString(), 123);
        assert.equal(String(T.sync(function() { return 123; })), 123);
        assert.equal(T.sync(function() { return 123; }) + '', 123);
        assert.equal(T.sync(function() { return 123; }), 123);
    });
    it('Templates.render', function() {
        assert.equal(T.render(
            T.sync(function() { return T.data(123); }),
            function(error, result) {
                if (error) throw error;
                assert.equal(result, 123);
            }
        ));
    });
    it('rerender', function() {
        assert.equal(T.sync(function() { return T.data(123); }), 123);
    });
});
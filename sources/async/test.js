describe('async', function() {
    it('calling', function() {
        T.async(function(callback) { callback(null, 123); })(function(error, result) {
            if (error) throw error;
            assert.equal(result, 123);
        });
    });
    it('.toString', function() {
        assert.equal(T.async(function(callback) { callback(null, 123); }).toString(), 123);
        assert.equal(String(T.async(function(callback) { callback(null, 123); })), 123);
        assert.equal(T.async(function(callback) { callback(null, 123); }) + '', 123);
        assert.equal(T.async(function(callback) { callback(null, 123); }), 123);
    });
});
describe('async', function() {
    it('function', function() {
        assert(is.function(T.async(function() {})));
    });
    it('()', function(done) {
        T.async(function(callback) {
            callback(null, 123);
        })(function(error, result) {
            if (error) throw error;
            assert.equal(result, 123);
            done();
        });
    });
    it('timeout', function(done) {
        T.async(function(callback) {
            setTimeout(function() {
                callback(null, 123);
            }, 10);
        })(function(error, result) {
            if (error) throw error;
            assert.equal(result, 123);
            done();
        });
    });
    it('.toString as sync', function() {
        assert.equal(T.async(function(callback) {
            callback(null, 123);
        }), 123);
    });
    it('.toString timeout error', function() {
        assert.throw(function() {
            T.async(function(callback) {
                setTimeout(function() {
                    callback(null, 123);
                }, 10);
            }).toString();
        });
    });
    it('rerender', function() {
        assert.equal(String(T.async(function(callback) { callback(null, T.data(123)); })), 123);
    });
});
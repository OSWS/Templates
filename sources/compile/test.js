describe('compile', function() {
    var check = function(assert, wait) {return function(error, result) {
        if (error) throw error;
        assert(result, wait);
    }};
    describe('function', function() {
        
        it('native', function() {
            T.compile(123, {}, function(e, d) {
                if (e) throw e;
                assert.equal(d, 123)
            });
            T.compile('123', {}, function(e, d) {
                if (e) throw e;
                assert.equal(d, '123');
            });
        });
    });
    
    describe('object', function() {
        
        it('native', function() {
            T.compile([1, '2', 3], {}, function(e, d) {
                if (e) throw e;
                assert.deepEqual(d, [1, '2', 3]);
            });
            T.compile({a: 1, b: '2', c: 3}, {}, function(e, d) {
                if (e) throw e;
                assert.deepEqual(d, {a: 1, b: '2', c: 3});
            });
        });
    });
    
    describe('sync', function() {
        
        it('return number', function() {
            T.compile(T.sync(function() { return 123; }), {}, function(e, d) {
                if (e) throw e;
                assert.equal(d, 123);
            });
        });
        
        // The returned data is also compiled?
        it('return sync', function() {
            T.compile(T.sync(function() { return T.sync(function() { return 123; }); }), {}, function(e, d) {
                if (e) throw e;
                assert.equal(d, 123);
            });
        });
    });
    
    describe('async', function() {
        
        it('callback number', function() {
            T.compile(T.async(function(callback) { callback(null, 123); }), {}, function(e, d) {
                if (e) throw e;
                assert.equal(d, 123);
            });
        });
        
        // The returned data is also compiled?
        it('callback sync', function() {
            T.compile(T.async(function(callback) { callback(null, T.sync(function() { return 123; })); }), {}, function(e, d) {
                if (e) throw e;
                assert.equal(d, 123);
            });
        });
    });
});
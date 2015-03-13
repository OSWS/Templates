describe('compile', function() {
    var check = function(assert, wait) {return function(error, result) {
        if (error) throw error;
        assert(result, wait);
    }};
    
    describe('native', function() {
        it('number', function(done) {
            T.compile(123, {}, function(e, d) {
                if (e) throw e;
                assert.equal(d, 123);
                done();
            });
        });
        it('string', function(done) {
            T.compile('123', {}, function(e, d) {
                if (e) throw e;
                assert.equal(d, '123');
                done();
            });
        });
        it('array', function(done) {
            T.compile([1, '2', 3], {}, function(e, d) {
                if (e) throw e;
                assert.deepEqual(d, '123');
                done();
            });
        });
        it('object', function(done) {
            T.compile({a: 1, b: '2', c: 3}, {}, function(e, d) {
                if (e) throw e;
                assert.deepEqual(d, '[object Object]');
                done();
            });
        });
    });
    
    describe('sync', function() {
        
        it('return number', function(done) {
            T.compile(T.sync(function() { return 123; }), {}, function(e, d) {
                if (e) throw e;
                assert.equal(d, 123);
                done();
            });
        });
        
        // The returned data is also compiled?
        it('return sync', function(done) {
            T.compile(T.sync(function() { return T.sync(function() { return 123; }); }), {}, function(e, d) {
                if (e) throw e;
                assert.equal(d, 123);
                done();
            });
        });
        
        // Native context is equal to OSWS context?
        it('context', function(done) {
            T.compile(T.sync(function() { return T.sync(function() { return this.a; }); }), { a: 123 }, function(e, d) {
                if (e) throw e;
                assert.equal(d, 123);
                done();
            });
        });
    });
    
    describe('async', function() {
        
        it('callback number', function(done) {
            T.compile(T.async(function(callback) { callback(null, 123); }), {}, function(e, d) {
                if (e) throw e;
                assert.equal(d, 123);
                done();
            });
        });
        
        // The returned data is also compiled?
        it('callback sync', function(done) {
            T.compile(T.async(function(callback) { callback(null, T.sync(function() { return 123; })); }), {}, function(e, d) {
                if (e) throw e;
                assert.equal(d, 123);
                done();
            });
        });
        
        // Native context is equal to OSWS context?
        it('context', function(done) {
            T.compile(T.async(function(callback) { callback(null, T.sync(function() { return this.a; })); }), { a: 123 }, function(e, d) {
                if (e) throw e;
                assert.equal(d, 123);
                done();
            });
        });
    });
});
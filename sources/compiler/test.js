describe('compiler', function() {
    
    it('.data.compile', function(done) {
        T.Compiler().data(['123']).compile({}, function(error, result) {
            if (error) throw error;
            assert.equal(result, '123');
            done();
        });
    });
    it('.context', function(done) {
        assert.deepEqual(T.Compiler().context({ a: { b: 1 } }).context({ a: { c: 2 } })._context, { a: { b: 1, c: 2 } });
        done();
    });
    describe('stress tests', function() {
        this.timeout(100000);
        (function(count) {
            describe(count+' vertical', function() {
                var vertical = T.Compiler().data([]);
                it('create', function(done) {
                    for (var i = 0; i < count; i++) {
                        vertical._data.push([T.Compiler(i)]);
                    }
                    done();
                });
                it('compile', function(done) {
                    vertical.compile(function(error, result) {
                        if (error) throw error;
                        done();
                    });
                });
            });
        })(100000);
        (function(count) {
            describe(count+' horizontal', function() {
                var horizontal = T.Compiler();
                it('create', function(done) {
                    var cursor = horizontal;
                    for (var i = 0; i < count; i++) {
                        var temp = T.Compiler(i);
                        cursor._data = [temp];
                        var cursor = temp;
                    }
                    done();
                });
                it('compile', function(done) {
                    horizontal.compile(function(error, result) {
                        if (error) throw error;
                        done();
                    });
                });
            });
        })(100000);
    });
});
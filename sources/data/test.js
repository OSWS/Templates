describe('data', function() {
    
    it('.data.append.prepend', function() {
        assert.deepEqual(T.data().data(123).append(456).prepend(789)._data, [789, 123, 456]);
    });
    
    it('.compile', function(done) {
        T.data().data(123).append(456).prepend(789).compile(function(error, result) {
            if (error) throw error;
            assert.equal(result, '789123456');
            done();
        });
    });
    
    describe('stress tests', function() {
        (function(count) {
            describe(count+' vertical', function() {
                var vertical = T.data();
                it('create', function(done) {
                    for (var i = 0; i < count; i++) {
                        vertical.append(T.data(i));
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
                var horizontal = T.data();
                it('create', function(done) {
                    var cursor = horizontal;
                    for (var i = 0; i < count; i++) {
                        var temp = T.data(i);
                        cursor.append(temp);
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
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
        var vertical = T.data();
        it('create 100000 vertical', function(done) {
            for (var i = 0; i < 100000; i++) {
                vertical.append(T.data(i));
            }
            done();
        }); 
        var horizontal = T.data();
        it('create 700 horizontal', function(done) {
            var cursor = horizontal;
            for (var i = 0; i < 700; i++) {
                var temp = T.data(i);
                cursor.append(temp);
                var cursor = temp;
            }
            done();
        });
        it('compile 100000 vertical', function(done) {
            vertical.compile(function(error, result) {
                if (error) throw error;
                done();
            });
        });
        it('compile 700 horizontal', function(done) {
            horizontal.compile(function(error, result) {
                if (error) throw error;
                done();
            });
        });
    });
});
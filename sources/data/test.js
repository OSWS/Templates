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
});
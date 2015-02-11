describe('data', function() {
    it('.data .append .prepend', function() {
        assert.equal(T.Data().append(0).data(1).append(2).prepend(3)._data.join(''), 312);
    });
    it('.render callback', function(done) {
        T.Data().append(0).data(1).append(2).prepend(3).render(function(error, result) {
            assert.equal(result, 312);
            done();
        });
    });
    it('.render return', function() {
        assert.equal(T.Data().append(0).data(1).append(2).prepend(3).render(), 312);
    });
    it('.context', function() {
        assert.equal(T.Data().data(1, '<%= a %>', '<%= b %><%= b + 1 %>').context({ a: 2, b: 3 }), 1234);
    });
    it('.render context', function() {
        assert.equal(T.Data().data(1, '<%= a %>', '<%= b %><%= b + 1 %>').render({ a: 2, b: 3 }), 1234);
    });
    it('.toString', function() {
        assert.equal(T.Data().append(0).data(1).append(2).prepend(3), 312);
    });
    it('inhritance', function() {
        var c = T.Data().append(0).data(1).append(2).prepend(3).extend();
        var i = c().append(4);
        assert.equal(i, 3124);
    });
    it('useful', function() {
        assert.equal(T.data(1, 2, 3), 123);
    });
    it('static', function() {
        var c = T.Data().append(0).data(1).append(2).prepend(3).extend();
        var i = c.append(4);
        assert.equal(i, 3124);
    });
});
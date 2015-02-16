describe('data', function() {
    it('instance .append .data .prepend', function() {
        assert.equal(T.Data().append(0).data(1).append(2).prepend(3)._data.join(''), 312);
    });
    it('static .append .data .prepend', function() {
        var c = T.Data().append(0).data(1).append(2).prepend(3).extend();
        var i = c.append(4);
        assert.equal(i, 3124);
    });
    it('useful', function() {
        assert.equal(T.data(1, 2, 3), 123);
    });
});
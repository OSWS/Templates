describe('renderer', function() {
    it('.render callback', function(done) {
        var r = T.Renderer();
        r._data = 123;
        r.render(function(error, result) {
            assert.equal(result, 123);
            done();
        });
    });
    it('.render return', function() {
        var r = T.Renderer();
        r._data = 123;
        assert.equal(r.render(), 123);
    });
    it('.context', function() {
        var r = T.Renderer();
        r._data = '1<%= a %><%= b %><%= b + 1 %>';
        assert.equal(r.context({ a: 2, b: 3 }), 1234);
    });
    it('.render context', function() {
        var r = T.Renderer();
        r._data = '1<%= a %><%= b %><%= b + 1 %>';
        assert.equal(r.render({ a: 2, b: 3 }), 1234);
    });
    it('.toString', function() {
        var r = T.Renderer();
        r._data = 123;
        assert.equal(r, 123);
    });
    it('instance .data', function() {
        var r = T.Renderer().data(123);
        var c = r.extend();
        var i = c();
        assert.equal(i, 123);
    });
    it('static .data', function() {
        var r = T.Renderer().data(123);
        var c = r.extend();
        assert.equal(c, 123);
    });
});
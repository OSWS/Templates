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
    it('contexts', function() {
        var i1 = T.Renderer.data('<%= a %>').context({ a: 1 });
        assert.equal(i1, 1);
        var i2 = T.Renderer.data(i1).context({ a: 2 });
        assert.equal(i2, 2);
        assert.equal(i2._data, 1);
        var i3 = i2.extend().context({ a: 3 });
        assert.equal(i3, 3);
        assert.equal(i3._parent, 2);
        assert.equal(i3._data, 1);
        var i4 = T.Renderer.data(i3.render()).context({ a: 4 });
        assert.equal(i4, 3);
    });
    it('.toString', function() {
        var i = T.Renderer.data(123);
        var r = i.render();
        assert.equal(i.toString(), 123);
        assert.equal(r.toString(), 123);
        assert.equal(String(i), 123);
        assert.equal(String(r), 123);
        assert.equal(i + '', 123);
        assert.equal(r + '', 123);
        assert.equal(i, 123);
        assert.equal(r, 123);
    });
});
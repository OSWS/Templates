describe('render', function() {
    describe('Templates.render', function() {
        describe('function', function() {
            it('any', function() {
                T.render(function() {}, function(error, result) {
                    if (error) throw error;
                    assert.equal(result, (function() {}).toString());
                });
            });
            it('Templates.sync', function() {
                T.render(T.sync(function() { return 123; }), function(error, result) {
                    if (error) throw error;
                    assert.equal(result, 123);
                });
            });
            it('Templates.async', function() {
                T.render(T.async(function(callback) {
                    setTimeout(function() { callback(null, 123); }, 10);
                }), function(error, result) {
                    if (error) throw error;
                    assert.equal(result, 123);
                });
            });
        });
        describe('object', function() {
            it('Templates.Renderer', function() {
                T.render(T.Renderer().data(123), function(error, result) {
                    if (error) throw error;
                    assert.equal(result, 123);
                });
            });
            it('Templates.data', function() {
                T.render(T.data(1, 2, 3), function(error, result) {
                    if (error) throw error;
                    assert.equal(result, 123);
                });
            });
            it('Templates.mixin', function() {
                T.render(T.mixin(function(a) { return T.data(a, '<%= b %>'); })(12), function(error, result) {
                    if (error) throw error;
                    assert.equal(result, 123);
                }, { b: 3 });
            });
        });
    });
    it('Templates.renderSelector', function() {
        var selector = ".class-.fdsaDss.pngClas-gfdreDS#Id1#Id2[attr1=http://google.com/images/logo.png,attr2='http://.com/images/logo.png']" + '[attr3=".com/images/logo.png"' + ",attr4'attr5'" + '"attr6"][alt=#item]';
        var attributes = {};
        T.renderSelector(attributes, selector);
        assert.deepEqual(attributes, {
            class: 'class- fdsaDss pngClas-gfdreDS',
            id: 'Id2',
            attr1: 'http://google.com/images/logo.png',
            attr2: 'http://.com/images/logo.png',
            attr3: ".com/images/logo.png",
            attr4: null,
            "'attr5'": null,
            '"attr6"': null,
            alt: "#item"
        });
    });
});
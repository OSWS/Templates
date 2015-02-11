describe('render', function() {
    it('function', function() {
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
            setTimeout(function() { callback(123); }, 10);
        }), function(error, result) {
            if (error) throw error;
            assert.equal(result, 123);
        });
    });
    it('Templates.Data', function() {
        T.render(T.Data().data(1, 2, 3), function(error, result) {
            if (error) throw error;
            assert.equal(result, 123);
        });
    });
    it('selector', function() {
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
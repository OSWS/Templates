describe('render', function() {
    it('Templates.render', function() {
        var check = function(assert, wait) {
            return function(error, result) {
                if (error) throw error;
                assert(result, wait);
            }
        };
        T.render(123, check(assert.equal, 123));
        T.render('string', check(assert.equal, "string"));
        var f = function() {};
        T.render(f, check(assert.equal, f));
        T.render([1, 2, 3], check(assert.deepEqual, [1, 2, 3]));
        T.render({ a: 1, b: 2, c: 3}, check(assert.deepEqual, { a: 1, b: 2, c: 3 }));
        T.render(T.sync(function() { return 123; }), check(assert.equal, 123));
        T.render(T.async(function(callback) { callback(null, 123); }), check(assert.equal, 123));
        T.render(T.Renderer().data(123), check(assert.equal, 123));
        T.render([
            T.sync(function() { return 1; }),
            T.async(function(callback) { callback(null, 2); }),
            T.Renderer().data(3)
        ], check(assert.deepEqual, [1, 2, '3']));
        T.render({
            a: T.sync(function() { return 1; }),
            b: T.async(function(callback) { callback(null, 2); }),
            c: T.Renderer().data(3)
        }, check(assert.deepEqual, { a: 1, b: 2, c: '3' }));
    });
    it('Templates.renderAttributes', function() {
        T.renderAttributes({
            a: 'string',
            b: null,
            c: T.sync(function() { return 'sync' }),
            d: T.async(function(callback) { callback(null, 'async'); }),
            e: T.Renderer().data('<%= e %>')
        }, function(error, result) {
            if (error) throw error;
            assert.equal(result, ' a="string" b c="sync" d="async" e="data"');
        }, { e: 'data' });
    });
    it('Templates.renderSelector', function() {
        var selector = '.class-name.withBig.letters.AndFromIt#Id1#Id2[attr1=http://link.without/quotes.png,attr2=' + "'http://link.with/single/quotes'" + '][attr3="http://link.with/double/quotes",attr4' + "'attr5'"+' "attr6"][alt=#simple!]';
        var attributes = {};
        T.renderSelector(attributes, selector);
        assert.deepEqual(attributes, {
            class: 'class-name withBig letters AndFromIt',
            id: 'Id2',
            attr1: 'http://link.without/quotes.png',
            attr2: 'http://link.with/single/quotes',
            attr3: "http://link.with/double/quotes",
            attr4: null,
            "'attr5'": null,
            '"attr6"': null,
            alt: "#simple"
        });
    });
});
describe('mixin', function() {
    it('multiple', function() {
        assert.equal(T.mixin(function(a) {
            return T.data(T.doubles.div()(T.singles.img({ a: a })), T.data('data'));
        })(1), '<div><img a="1"/></div>data');
    });
});
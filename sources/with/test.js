describe('with', function() {
    it('exists', function() {
        assert(is.function(T.with.mixin));
        assert(is.function(T.with.data));
        assert(is.function(T.with.xml));
        assert(is.function(T.with.doctypes.html));
        assert(is.function(T.with.img));
        assert(is.function(T.with.div));
        assert(is.function(T.with.sync));
        assert(is.function(T.with.async));
    });
});
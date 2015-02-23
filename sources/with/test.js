describe('with', function() {
    it('exists', function() {
        assert(_.isFunction(T.with.sync));
        assert(_.isFunction(T.with.async));
        assert(_.isFunction(T.with.data));
        assert(_.isFunction(T.with.xml));
        assert(_.isFunction(T.with.doctypes.html));
        assert(_.isFunction(T.with.img));
        assert(_.isFunction(T.with.div));
        assert(_.isFunction(T.with.mixin));
        assert(_.isFunction(T.with.js));
    });
});
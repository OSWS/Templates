describe('double', function() {
    it('div', function() {
        assert.equal(T.Double('.test')('data').name('div'), '<div class="test">data</div>');
    });
    it('inheritance', function() {
        assert.equal(String(T.Double('.test')('data').name('div').extend()), '<div class="test">data</div>');
    });
    it('construct', function() {
        assert.equal(String(T.Double('.test')('data').name('div').extend().construct()), '<div class="test">data</div>');
    });
});
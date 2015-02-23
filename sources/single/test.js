describe('single', function() {
    it('img', function() {
        assert.equal(T.Single('[src=image.jpg]').name('img'), '<img src="image.jpg"/>');
    });
    it('inheritance', function() {
        assert.equal(String(T.Single('[src=image.jpg]').name('img').extend()), '<img src="image.jpg"/>');
    });
});
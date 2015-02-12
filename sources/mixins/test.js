describe('mixins', function() {
    it('js src', function() {
        assert.equal(String(T.mixins.js('script.js')), '<script type="text/javascript" src="script.js"></script>');
    });
    it('js code', function() {
        assert.equal(String(T.mixins.js(function() {console.log();})), '<script type="text/javascript">console.log();</script>');
    });
    it('css', function() {
        assert.equal(String(T.mixins.css('style.css')), '<link rel="stylesheet" href="style.css"/>');
    });
});
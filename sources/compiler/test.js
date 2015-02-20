describe('compiler', function() {
    describe('Templates.compile', function() {
        it('once', function() {
            assert.equal(T.compile('module.exports = __filename + 1;', __dirname + '/0'), __dirname + '/01');
        });
        it('equal path', function() {
            assert.equal(T.compile('module.exports = __filename + 1;', __dirname + '/1'), __dirname + '/11');
            assert.equal(T.compile('module.exports = __filename + 2;', __dirname + '/1'), __dirname + '/12');
        });
    });
    it('Templates.include', function() {
        assert.equal(T.include('include0.js'), path.join(__dirname, 'include0.js'));
    });
});
describe('compiler', function() {
    it('Templates.compile', function() {
        assert.equal(T.compile('module.exports = __filename + 1;', __dirname + '/0'), __dirname + '/01');
        assert.equal(T.compile('module.exports = __filename + 2;', __dirname + '/0'), __dirname + '/02');
    });
    it('Templates.include', function() {
        assert.equal(T.include('include0.js'), __dirname + '/include0.js');
    });
});
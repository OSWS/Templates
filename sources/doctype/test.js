describe('doctype', function() {
    it('html', function() {
        assert.equal(T.Doctype('[html]'), '<!DOCTYPE html>');
    });
});
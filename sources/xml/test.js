describe('xml', function() {
    it('declaration', function() {
        assert.equal(String(T.xml('[version="1.0" encoding="UTF-8" standalone="no"]')), '<?xml version="1.0" encoding="UTF-8" standalone="no"?>');
    });
});
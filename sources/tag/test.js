describe('tag', function() {
    it('.name', function() {
        assert.equal(T.Tag().name('div')._name, 'div');
    });
    it('.selector', function() {
        assert.deepEqual(T.Tag.selector('.class')._attributes, { class: 'class' });
    });
    it('.attributes', function() {
        assert.deepEqual(T.Tag.attributes({ key: 'value' })._attributes, { key: 'value' });
    });
});
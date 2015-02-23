describe('tag', function() {
    it('instance .name', function() {
        assert.equal(T.Tag().name('div')._name, 'div');
    });
    it('static .selector', function() {
        assert.deepEqual(T.Tag.selector('.class')._attributes, { class: 'class' });
    });
    it('static .attributes', function() {
        assert.deepEqual(T.Tag.attributes({ key: 'value' })._attributes, { key: 'value' });
    });
});
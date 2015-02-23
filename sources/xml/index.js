(function() {

// [new] (...arguments: Array<TSelector|TAttributes>) => this;
T.xml = T.Tag.extend(function() {
    this._name = 'xml';
    this._renderTag = function(name, data, attributes, callback) {
        callback(null, '<?' + name + attributes + '?>');
    };
});

})();
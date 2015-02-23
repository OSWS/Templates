(function() {

// [new] (...arguments: Array<TSelector|TAttributes>) => this;
T.Doctype = T.Tag.extend(function() {
    this._name = 'DOCTYPE';
    this._renderTag = function(name, data, attributes, callback) {
        callback(null, '<!' + name + attributes + '>');
    };
});

})();
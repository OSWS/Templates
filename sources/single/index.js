(function() {

// [new] (...arguments: Array<TSelector|IAttributes>) => this;
T.Single = T.Tag.extend(function() {
    this._renderTag = function(name, data, attributes, callback) {
        callback(null, '<'+name + attributes+'/>');
    };
});

})();
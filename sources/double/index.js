(function() {

// [new] (...arguments: Array<TSelector|IAttributes>) => [new] (...arguments: Array<TData>) => this;
T.Double = T.Tag.extend(function() {
    this.construct = function() {
        return this()();
    };
    this._renderTag = function(name, data, attributes, callback) {
        callback(null, '<' + name + attributes + '>' + data + '</' + name + '>');
    };
    this.returner = function() {
        var instance = this;
        return instance.extend(function() {
            this.constructor = function() {
                if (arguments.length > 0) instance.data.apply(instance, arguments);
            };
            this.returner = function() { return instance; };
        });
    };
});

})();
(function() {

// Universal renderer for any type data.

// Arguments for data-mixin send to second call quotes.
// var module = T.Module(anyData)(...mixinArguments);

// [new] (data: TData) => (...arguments: any[]) => this;
T.Module = T.Renderer.extend(function() {
    var parent = this._parent;
    
    // (data: TData)
    this.constructor = function(data) {
        parent.constructor.call(this);
        
        if (!_.isUndefined(data)) this._data = data;
    };
    
    this.returner = function() {
        var instance = this;
        return instance.extend(function() {
            var parent = this._parent;
            
            this.constructor = function() {
                parent.constructor.call(this);
                
                if (_.isFunction(this._data) && this._data.prototype instanceof T.Mixin) this._data = T.data(this._data.apply(this, arguments));
                else this._data = T.data(this._data);
            };
            
            this.returner = function() { return this; };
        });
    };
});

})();
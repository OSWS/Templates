(function() {

// new () => this;
T.Data = (new T.Prototype()).extend('render', '_render', 'toString', 'prepend', 'data', 'append', function() {
    var parent = this._parent;
    
    // data
    
    // Array<TData>;
    this._data = undefined;

    // (...arguments: Array<TData>) => this;
    this.prepend = function() {
        this._data.unshift.apply(this._data, arguments);
        return this;
    };

    // (...arguments: Array<TData>) => this;
    this.data = function() {
        this._data = Array.prototype.slice.call(arguments);
        return this;
    };

    // (...arguments: Array<TData>) => this;
    this.append = function() {
        this._data.push.apply(this._data, arguments);
        return this;
    };
    
    // context
    
    // IContext;
    this._context = {};
    
    // (...arguments: Array<IContext>) => this;
    this.context = function() {
        for (var a in arguments) {
            _.extend(this._context, arguments[a]);
        };
        return this;
    };
    
    // constructor
    
    this.constructor = function() {
        parent.constructor.call(this);
        
        // data
        
        this._data = [];
        if (_.isArray(this._parent._data)) this._data = this._parent._data.slice(0);
        
        // context
        
        this._context = {};
    };
    
    // render
    
    // (...arguments: Array<TCallback{1}, IContext>) => TAsync(callback: TCallback) => void;
    this.render = function() {
        var callback = false;
        var context = {};
        
        for (var a in arguments) {
            if (_.isFunction(arguments[a])) callback = arguments[a];
            else if (_.isObject(arguments[a])) _.extend(context, arguments[a]); 
        }
        
        if (callback) this._render(callback, context);
        
        var instance = this;
        
        return T.async(function(callback) {
            instance._render(callback, context);
        });
    };
    
    // (callback: TCallback, context: IContext) => this;
    this._render = function(callback, _context) {
        var context = _.extend({}, this._context);
        _.extend(context, _context);
        T.render(this._data, function(error, result) {
            if (error) callback(error);
            else T.render(context, function(error, renderedContext) {
                if (error) callback(error);
                else T.renderContext(result.join(''), renderedContext, callback);
            }, context);
        }, context);
    };
    
    // () => string
    this.toString = function() {
        return String(this.render());
    };
});

T.data = T.Data.extend(function() {
    var parent = this._parent;
    
    this.constructor = function() {
        parent.constructor.apply(this);
        
        this.data.apply(this, arguments);
    };
});

})();
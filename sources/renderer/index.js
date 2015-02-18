(function() {

// Simple data rendering from instance or static element.
// Not intended for use immediately! Only inheritance!
// Supports basic functionality works with contexts.

// Not for end-use! Only as a prototype!

// [new] () => this;
T.Renderer = (new T.Prototype()).extend('data', 'context', 'render', '_render', 'toString', function() {
    var parent = this._parent;
    
    // data
    
    // TData;
    this._data = undefined;

    // (data: TData) => this;
    this.data = function(data) {
        this._data = data;
        return this;
    };
    
    // context
    
    // TContext;
    this._context = {};
    
    // (...arguments: Array<TContext>) => this;
    this.context = function() {
        for (var a in arguments) {
            _.extend(this._context, arguments[a]);
        };
        return this;
    };
    
    // constructor
    
    this.constructor = function() {
        parent.constructor.call(this);
        
        // context
        
        this._context = {};
    };
    
    // render
    
    // (...arguments: Array<TCallback{1}, TContext>) => TAsync(callback: TCallback) => void;
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
    
    // (callback: TCallback, context: TContext) => this;
    this._render = function(callback, _context) {
        var context = _.extend({}, this._context);
        _.extend(context, _context);
        T.render(this._data, function(error, result) {
            if (error) callback(error);
            else T.render(context, function(error, renderedContext) {
                if (error) callback(error);
                else T.renderContext(_.isArray(result)? result.join('') : result, renderedContext, callback);
            }, context);
        }, context);
        return this;
    };
    
    // () => string;
    this.toString = function() {
        return String(this.render());
    };
});

})();
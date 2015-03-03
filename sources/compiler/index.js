// Support for TData, TContext and compilation.

module.exports = function(exports) {
    
    exports.extendContextOnCompile = function(compiler, argumentContext) {
        if (typeof(argumentContext) == 'undefined') return compiler._context;
        else if (typeof(argumentContext) == 'object' && typeof(compiler._context) == 'object') {
            return require('merge').recursive(compiler._context, argumentContext);
        } else return argumentContext;
    };
    
    // [new] () => this;
    exports.Compiler = (new exports.Class())
    .extend(function() {
        var prototype = this.___prototype;
        
        // TData;
        // this._data = undefined;
        
        // (data: TData) => this;
        this.data = function(data) {
            this._data = data;
            
            return this;
        };
        
        // (context?: TContext, callback: TCallback) => async;
        this.compile = function() {
            var instance = this;
            
            var context = undefined;
            var callback = undefined;
            
            if (typeof(arguments[0]) == 'object') context = arguments[0];
            
            if (typeof(arguments[0]) == 'function') callback = arguments[0];
            else if (typeof(arguments[1]) == 'function') callback = arguments[1];
            
            var async = exports.async(function(callback) {
                instance.__compile(context, callback);
            });
            
            if (callback) async(callback);
            
            return async;
        };
        
        // (context: TContext, callback: TCallback) => this;
        this.__compile = function(context, callback) {
            exports.compile(this._data, exports.extendContextOnCompile(this, context), callback);
            
            return this;
        };
        
        // TContext;
        // this._context = undefined;
        
        // (context: TContext) => this;
        this.context = function(context) {
            if (!Object.prototype.hasOwnProperty.call(this, '_context')) this._context = context;
            else this._context = require('merge').recursive(this._context, context);
            
            return this;
        };
        
        this.extend = function() {
            var extension = prototype.extend.apply(this, arguments);
            exports.static(extension, 'data');
            exports.static(extension, 'context');
            exports.static(extension, 'compile');
            exports.static(extension, '__compile');
            return extension;
        };
    })
    .extend();
};
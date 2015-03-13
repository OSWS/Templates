// Support for TData, TContext and compilation.

module.exports = function(exports) {
    
    // [new] () => this;
    exports.Compiler = (new exports.Class())
    .extend(function() {
        var prototype = this.___prototype;
        
        // Array<TData>;
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
                exports.compile(instance, context, callback);
            });
            
            if (callback) async(callback);
            
            return async;
        };
        
        // () => TData;
        this.__compile = function() {
            return this._data;
        }
        
        // TContext;
        // this._context = undefined;
        
        // (context: TContext) => this;
        this.context = function(context) {
            if (!Object.prototype.hasOwnProperty.call(this, '_context')) this._context = context;
            else this._context = require('merge').recursive(this._context, context);
            
            return this;
        };
        
        // () => Object <= TContext;
        this.__extendContexts = function(context) {
            if (typeof(context) == 'undefined') return this._context;
            else if (typeof(context) == 'object' && typeof(this._context) == 'object') {
                return require('merge').recursive(this._context, context);
            } else return context;
        };
        
        this.extend = function() {
            var extension = prototype.extend.apply(this, arguments);
            exports.static(extension, 'data');
            exports.static(extension, 'context');
            exports.static(extension, 'compile');
            return extension;
        };
    })
    .extend();
};
// Compilation node.
// Basic methods.

// Example:
/*
var first = new Class(); // New operator necessary.
var Second = first.extend(); // Inherit next.
var second = Second(); // New not necessary.
*/

module.exports = function(exports) {

// [new] () => this;
exports.Node = (new exports.Class()).extend(function() {
    var prototype = this.___prototype;
    
    // Compile support.
    
    // Unsafe compile method.
    // (compilation: Compilation) => TData;
    this.__compile = function() { return ''; }
    
    // Safe compile method.
    // (context?: TContext, callback: TCallback) => async;
    this.compile = function() {
        var instance = this;
        
        // arguments
        
        var context = undefined;
        var callback = undefined;
        
        for (var a in arguments) {
            if (typeof(arguments[a]) == 'function') {
                if (!callback) {
                    callback = arguments[a];
                } else if (!context) {
                    context = callback;
                    callback = arguments[a];
                }
            }
        }
        
        // callback
        
        if (callback) exports.compileAsync(instance, context, callback);
        
        // return
        
        return exports.async(function(_context, callback) {
            exports.compileAsync(instance, context, callback);
        });
    };
    
    // Native compiler.
    // () => string;
    this.toString = function() {
        return exports.compileSync(this, {});
    };
        
    // Context support.
    
    // TContext;
    // this._context = undefined;
    
    // (context: TContext) => this;
    this.context = function(context) {
        this._context = context;
        
        return this;
    };
    
    // Construction.
    
    this.__constructor = function() {
        if (prototype.__constructor) prototype.__constructor.apply(this, arguments);
        
        // Unsupport inheritance variable.
        this._context = undefined;
    };
    
    // Static options support.
    
    this.extend = function() {
        var extension = prototype.extend.apply(this, arguments);
        exports.__static(extension, 'compile');
        exports.__static(extension, 'toString');
        exports.__static(extension, 'context');
        return extension;
    };
    
}).extend();

};
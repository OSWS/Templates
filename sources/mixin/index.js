// Mixin class.

// Example:
/*
var example = mixin(function(a, b, c) { return a+b+c; });
example(1, 2, 3); // 6
example instanceof mixin // true
*/

// TMixin = (...arguments) => TData;

module.exports = function(exports) {

// [new] (action: TMixin) => this;
exports.mixin = exports.Node().extend(function() {
    var prototype = this.___prototype;
    
    // Action support.
    
    // TMixin;
    // this._action = undefined;
    
    // Compile support.
    
    // Unsafe compile method.
    // (compilation: Compilation) => TData;
    this.__compile = function() {
        if (typeof(this._action) == 'function') return this._action.apply(this, this.___arguments);
        else return '';
    }
    
    // Construction.
    
    this.__constructor = function(action) {
        if (prototype.__constructor) prototype.__constructor.apply(this, arguments);
        
        this._action = action;
    };
    
    this.__returner = function() {
        var instance = this;
        var temp = function Class() {
            return temp.__construct.apply(this, arguments);
        };
        temp.prototype = this;
        temp.__construct = function() {
            instance.___arguments = arguments;
            return instance;
        };
        return temp;
    }
    
    this.__construct = function() {
        return this()();
    };
    
})()().extend();

};
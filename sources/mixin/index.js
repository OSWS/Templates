// Mixin class.

module.exports = function(exports) {

// [new] (...arguments) => this;
exports.mixin = exports.Node().extend(function() {
    var prototype = this.___prototype;
    
    // Action support.
    
    // function;
    // this._action = undefined;
    
    // Compile support.
    
    // Unsafe compile method.
    // (compilation: Compilation) => this;
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
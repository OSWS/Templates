// Class system.
// Not necessary use new operator.
// Useful inheritance.

// Example:
/*
var first = new Class(); // New operator necessary.
var Second = first.extend(); // Inherit next.
var second = Second(); // New not necessary.
*/

module.exports = function(exports) {

exports.Class = function() {
    
    // Prototype of this class instance. Other instance.
    // Class;
    // this.___prototype = undefined;
    
    // Constructor of this class instance. Other instance.
    // function;
    // this.___factory = undefined;
    
    // That will be returned after the construction?
    // () => any;
    this.__returner = function() { return this; };
    
    // What should be done in the construction?
    // function;
    // this.__constructor = undefined;
    
    // Inheritance method.
    // Argument injector is performed only for this inheritor, unlike .__constructor.
    // (injector: TInjector) => function;
    this.extend = function(injector) {
        if (typeof(injector) != 'function') var injector = function() {};
        
        var prototype = this;
        
        var _arguments = undefined;
        
        var Inheritor;
        
        Inheritor = function Class() {
            if (this instanceof Class) { // new ()
                
                if(Object.prototype.toString.call(_arguments) == '[object Arguments]') {
                    var __arguments = _arguments;
                    _arguments = undefined;
                } else {
                    var __arguments = arguments;
                }
                
                this.___prototype = prototype;
                this.___factory = Inheritor;
                
                injector.call(this);
                if (typeof(this.__constructor) == 'function') this.__constructor.apply(this, __arguments);
            
            } else { // ()
                _arguments = arguments;
                var instance = new Inheritor();
                return instance.__returner(instance);
            }
        };
        
        Inheritor.prototype = prototype;
        
        // Static data.
        Inheritor.__construct = prototype.__construct;
        exports.__static(Inheritor, 'extend');
        
        return Inheritor;
    };
    
    // Automatic constructor for static usage.
    // () => this;
    this.__construct = function() { return this.apply(this, arguments); };
};

};
// Classes system.

module.exports = function(exports) {

    // new () => this;
    exports.Class = function() {
        
        // Prototype of this class instance. Other instance.
        // Class;
        // this.___prototype = undefined;
        // set on extend
        
        // Constructor of this class instance. Other instance.
        // Function;
        // this.___factory = undefined;
        // set on extend
        
        // Arguments passed when constructing.
        // arguments;
        // this.___arguments = undefined;
        // set on construct
        
        // That will be returned after the construction?
        // () => any;
        this.__returner = function() { return this; };
        // set on extend
        // call on constrct
        
        // What should be done in the construction?
        // Function
        // this.__constructor = undefined
        // set on extend
        // call on constrct
        
        // Method for inheritance.
        // Argument injector is performed only for this inheritor, unlike .__constructor.
        // (injector: TInjector) => Function;
        this.extend = function(injector) {
            if (typeof(injector) != 'function') var injector = function() {};
            
            var prototype = this;
            
            var _arguments = undefined;
            
            var P;
            
            P = function Class() {
                if (this instanceof exports.Class) { // new ()
                    
                    if(Object.prototype.toString.call(_arguments) == '[object Arguments]') {
                        var __arguments = _arguments;
                        _arguments = undefined;
                    } else {
                        var __arguments = arguments;
                    }
                    
                    this.___prototype = prototype;
                    this.___factory = P;
                    this.___arguments = __arguments;
                    
                    injector.call(this);
                    if (typeof(this.__constructor) == 'function') this.__constructor.apply(this, __arguments);
                
                } else { // ()
                    _arguments = arguments;
                    var instance = new P();
                    return instance.__returner(instance);
                }
            };
            
            P.prototype = prototype;
            
            P.__construct = prototype.__construct;
            exports.static(P, 'extend');
            
            return P;
        };
        
        // Automatic constructor for static usage.
        // () => this;
        this.__construct = function() { return this.apply(this, arguments); };
        // set on extend
    };
};
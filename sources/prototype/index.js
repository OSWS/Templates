(function() {

// The main class for all classes.
// Remove need for using new operator.

// new () => this;
T.Prototype = function() {
    
    // Prototype;
    this._parent = undefined;

    // Set at construction.
    // Always available arguments passed to the .constructor.
    
    // arguments;
    this._arguments = undefined;
    
    // Sets the behavior at the time of construction.
    
    // () => any;
    this.returner = function() { return this; };
    
    // Sets the behavior at the time of construction in TInjector.
    
    // (...arguments: arguments) => any;
    this.constructor = function() {};
    
    // Set at inheritance in .extend.
    // Reference to prototype of this instance.

    // (...arguments: Array<TInjector|string>) => Function;
    this.extend = function() {
        var extendArguments = arguments;
        
        var injector = function() {
            for (var a in extendArguments) {
                if (_.isFunction(extendArguments[a])) extendArguments[a].call(this);
            }
        };
        
        var statics = [];
        
        for (var a in arguments) {
            if (_.isString(arguments[a])) statics.push(arguments[a]);
        }
        
        if (statics.length > 0) {
            var parent = this.extend(function() {
                var parent = this._parent;
                this._static = function() {
                    parent._static.call(this);
                    
                    T.static.apply(this, statics);
                };
            }).construct();
        } else var parent = this;

        var _arguments = undefined;
        
        function Element() {
            if (this instanceof T.Prototype) {

                if(_.isArguments(_arguments)) {
                    var __arguments = _arguments;
                    _arguments = undefined;
                } else {
                    var __arguments = arguments;
                }
                
                this._parent = parent;
                this._arguments = __arguments;
                
                injector.call(this);
                if (_.isFunction(this.constructor)) this.constructor.apply(this, __arguments);

            } else {
                _arguments = arguments;
                var instance = new Element();
                return instance.returner(instance);
            }
        };
        
        Element.prototype = parent;
        
        if (_.isFunction(parent._static)) {
            parent._static.call(Element);
        }
        
        return Element;
    };
    
    // Is called when a successor constructor.
    // Allows you to create static options.
    
    // () => void;
    this._static = function() {
        this.toString = function() { return ''; };
        this.construct = function() { return this.apply(this, arguments); };
        T.static.call(this, 'extend');
    }
};

})();
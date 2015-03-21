(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Class system.
// Not necessary use new operator.
// Useful inheritance.

// Example:
/*
var first = new Class(); // New operator necessary.
var Second = first.extend(); // Inherit next.
var second = Second(); // New not necessary.
*/

var __static = require('../static').__static;

var Class = function() {
    
    // Prototype of this class instance. Other instance.
    // Class;
    // this.___prototype = undefined;
    
    // Constructor of this class instance. Other instance.
    // Function;
    // this.___factory = undefined;
    
    // That will be returned after the construction?
    // () => any;
    this.__returner = function() { return this; };
    
    // What should be done in the construction?
    // Function;
    // this.__constructor = undefined;
    
    // Inheritance method.
    // Argument injector is performed only for this inheritor, unlike .__constructor.
    // (injector: TInjector) => Function;
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
        __static(Inheritor, 'extend');
        
        return Inheritor;
    };
    
    // Automatic constructor for static usage.
    // () => this;
    this.__construct = function() { return this.apply(this, arguments); };
};

exports.Class = Class;
},{"../static":4}],2:[function(require,module,exports){
var compile = function() {};

exports.compile = compile;
},{}],3:[function(require,module,exports){
exports.Class = require('./class').Class;
exports.__static = require('./static').__static;

exports.compile = require('./compile').compile;

exports.sync = require('./sync').sync;
},{"./class":1,"./compile":2,"./static":4,"./sync":5}],4:[function(require,module,exports){
// Support static options to the class system.
// Add to extend.

// Example:
/*
var First = (new Class()).extend(function() {
    var prototype = this.___prototype;
    this.a = function(b) {
        return b;
    };
    this.extend = function() {
        var extension = prototype.extend.apply(this, arguments);
        __static(extension, 'a');
    };
})().extend();
First.a(123); // 123;
*/

// (extension: Function, key: string) => void;
var __static = function(extension, key) {
    extension[key] = function() {
        var instance = extension.__construct.call(this);
        return instance[key].apply(instance, arguments);
    };
};

exports.__static = __static;
},{}],5:[function(require,module,exports){
// Synchronously returned data on compile.

// Example:
/*
var s = sync(function(context) { return context.a; });
compile(s, { a: 123 }, function(error, result) {
    result // 123;
});
*/

var compile = require('../compile').compile;

var sync = function(argument) {
    var sync = function oswsSync() { return argument.apply(this, arguments); };
    sync.toString = function() {
        return String(compile(sync));
    };
    return sync;
};

exports.sync = sync;
},{"../compile":2}]},{},[3])
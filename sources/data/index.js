// Simple data manager.

// Example:
/*
var example = Node().extend(function() {
    this.__compile = function() { return 'true'; };
});
example.compile(function(error, result) {
    result; // 'true'
});
*/

module.exports = function(exports) {

// [new] (...data?: Array<TData>) => this;
exports.data = exports.Node().extend(function() {
    var prototype = this.___prototype;
    
    // Data support.
    
    // Array<TData>;
    // this._data = undefined;
    
    // (...data: Array<TData>) => this;
    this.data = function() {
        this._data = Array.prototype.slice.call(arguments, 0);
        
        return this;
    };
    
    // (...data: Array<TData>) => this;
    this.append = function() {
        if (typeof(this._data) != 'object' || Object.prototype.toString.call(this._data) != '[object Array]') this._data = [];
        this._data.push.apply(this._data, arguments);
        
        return this;
    };
    
    // (...data: Array<TData>) => this;
    this.prepend = function() {
        if (typeof(this._data) != 'object' || Object.prototype.toString.call(this._data) != '[object Array]') this._data = [];
        this._data.unshift.apply(this._data, arguments);
        
        return this;
    };
    
    // Compile support.
    
    // Unsafe compile method.
    // (compilation: Compilation) => TData;
    this.__compile = function() { return this._data; }
    
    // Construction.
    
    this.__constructor = function() {
        if (prototype.__constructor) prototype.__constructor.apply(this, arguments);
        
        // Data inheritance.
        arguments.length > 0 ? this.data.apply(this, arguments) : this._data = this.___prototype._data? Array.prototype.slice.call(this.___prototype._data, 0) : [];
    };
    
    // Static options support.
    
    this.extend = function() {
        var extension = prototype.extend.apply(this, arguments);
        exports.__static(extension, 'data');
        exports.__static(extension, 'append');
        exports.__static(extension, 'prepend');
        return extension;
    };
    
}).extend();

};
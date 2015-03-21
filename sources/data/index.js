// Simple data manager.

module.exports = function(exports) {

// [new] (data?: TData) => this;
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
    // (context: TContext, path: Array<TData>) => this;
    this.__compile = function() { return this._data; }
    
    // Construction.
    
    this.__constructor = function() {
        if (prototype.__constructor) prototype.__constructor.apply(this, arguments);
        
        // Unsupport inheritance variable.
        arguments.length > 0 ? this.data.apply(this, arguments) : this._data = undefined;
    };
    
    // Static options support.
    
    this.extend = function() {
        var extension = prototype.extend.apply(this, arguments);
        exports.__static(extension, 'data');
        return extension;
    };
    
}).extend();

};
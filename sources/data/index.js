// String data.

module.exports = function(exports) {
    
    // [new] (...data: TData) => this;
    exports.data = exports.Compiler
    .extend(function() {
        var prototype = this.___prototype;
        
        // TData;
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
        
        // (context: TContext, callback: TCallback) => this;
        this.__compile = function(context) {
            return this._data;
        };
        
        this.extend = function() {
            var extension = prototype.extend.apply(this, arguments);
            exports.static(extension, 'append');
            exports.static(extension, 'prepend');
            return extension;
        };
        
        this.__constructor = function() {
            if (prototype.__constructor) prototype.__constructor.call(this);
            if (this.data) this.data.apply(this, arguments);
        };
    }).extend();
};
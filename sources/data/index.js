// String data.

module.exports = function(exports) {
    
    // [new] (...data: TData) => this;
    exports.data = exports.Compiler
    .extend(function() {
        var prototype = this.___prototype;
        
        // TData;
        this._data = undefined;
        
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
        this.__compile = function(context, callback) {
            return prototype.__compile.call(this, context, function(error, data) {
                if (error) callback(error);
                else {
                    if (typeof(data) == 'object' && Object.prototype.toString.call(data) == '[object Array]') 
                        callback(null, data.join(''));
                    else callback(null, data);
                }
            });
        };
        
        this.extend = function() {
            var extension = prototype.extend.apply(this, arguments);
            exports.static(extension, 'append');
            exports.static(extension, 'prepend');
            return extension;
        };
        
        this.__constructor = function() {
            if (prototype.__constructor) prototype.__constructor.call(this);
            this.data.apply(this, arguments);
        };
    })
    .extend();
};
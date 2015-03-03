// At compile time can be transmitted to the context.
// This class can access it.

module.exports = function(exports) {
    
    // [new] (...path: Array<string>) => this;
    exports.context = exports.Compiler
    .extend(function() {
        var prototype = this.___prototype;
        
        // Path in TContext.
        // Array<string>;
        // this._data = undefined;
        
        // Way to add path.
        // (...path: Array<string>) => this;
        this.data = function() {
            if (!Object.prototype.hasOwnProperty.call(this, '_data')) this._data = [];
            this._data.push.apply(this._data, arguments);
            return this;
        };
        
        // () => any;
        this.__returner = function() {
            var _this = this;
            var ___arguments = [];
            var result = function() {
                ___arguments.push(arguments);
                return result;
            };
            result.___oswstContext = true;
            
            // () => this;
            result.__construct = function() {
                _this.___arguments = ___arguments;
                return _this;
            };
            
            // (context: TContext, callback: TCallback) => this;
            result.compile = result.__compile = function(context, callback) {
                exports.compile(this, context, callback);
                return this;
            };
            
            return result;
        };
        
        // .apply(this, ...path: Array<string>) => void;
        this.__constructor = function() {
            if (prototype.__constructor) prototype.__constructor.call(this);
            
            // If the injector does not set the path, then it will be set to an empty array.
            if (!Object.prototype.hasOwnProperty.call(this, '_data')) this._data = [];
            
            this.data.apply(this, arguments);
        };
        
        // (context: TContext, callback: TCallback) => this;
        this.__compile = function(context, callback) {
            try {
                var context = exports.contextTraveler.apply(context, this._data);
            } catch(error) {
                callback(error);
                return this;
            }
            try {
                if (this.___arguments.length) {
                    for (var a in this.___arguments) {
                        if (typeof(context) == 'function') var context = context.apply(this, this.___arguments[a]);
                    }
                }
            } catch(error) {
                callback(error);
                return this;
            }
            exports.compile(context, context, callback);
            return this;
        };
        
    })().__construct().extend();
    
    // .apply(this: TContext, arguments: Array<string>) => any;
    exports.contextTraveler = function() {
        var path = [];
        var cursor = this;
        for (var a in arguments) {
            path.push(arguments[a]);
            if (typeof(cursor) == 'object') {
                cursor = cursor[arguments[a]];
            } else {
                throw new Error('Error on step '+path.join('.')+' in path '+Array.prototype.join.call(arguments, '.')+'!');
            }
        };
        return cursor;
    };
    
    // (argument: Function) => boolean;
    exports.isContextFunction = function(argument) {
        return !!argument.___oswstContext;
    };
};
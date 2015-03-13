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
        
        // .apply(this, ...path: Array<string>) => void;
        this.__constructor = function() {
            if (prototype.__constructor) prototype.__constructor.call(this);
            
            // If the injector does not set the path, then it will be set to an empty array.
            if (!Object.prototype.hasOwnProperty.call(this, '_data')) this._data = [];
            
            this.data.apply(this, arguments);
        };
        
        // () => TData;
        this.__compile = function(_context) {
            var instance = this;
            return exports.async(function(callback) {
                try {
                    var context = exports.contextTraveler.apply(_context, instance._data);
                } catch(error) {
                    callback(error);
                    return;
                }
                exports.compile(context, {}, callback);
            });
        };
        
        // () => Array<any>|void;
        this.__compileChildren = undefined; // Custom data logic.
        
    });
    
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
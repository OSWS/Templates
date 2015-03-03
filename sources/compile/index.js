// Universal compiler.

module.exports = function(exports) {
    
    // (data: TData, context: TContext, result: TData, counter: number, keys: Array<string|number>, callback: TCallback) => void;
    var __compileCore = function(data, context, result, counter, keys, callback) {
        if (counter < keys.length) {
            exports.compile(data[keys[counter]], context, function(error, compiled) {
                if (error) callback(error);
                else {
                    result[keys[counter]] = compiled;
                    __compileCore(data, context, result, counter + 1, keys, callback);
                }
            });
        } else callback(null, result);
    };
    
    // (data: TData, context: TContext, callback: TCallback) => void;
    exports.compile = function(data, context, callback) {
        if (typeof(data) == 'function') {
            
            if (data.prototype instanceof exports.Compiler) data.__compile(context, callback);
            else if (exports.isSyncFunction(data)) exports.compile(data(), context, callback);
            else if (exports.isAsyncFunction(data)) data(function(error, data) {
                if (error) callback(error);
                else exports.compile(data, context, callback);
            });
            else if (exports.isContextFunction(data)) exports.compile(data.__construct(), context, callback);
            else callback(null, data);
            
        } else if (data && typeof(data) == 'object') {
            if (data instanceof exports.Compiler) data.__compile(context, callback);
            
            else {
                if (Object.prototype.toString.call(data) == '[object Array]') var result = [];
                else var result = {};
                __compileCore(data, context, result, 0, Object.keys(data), callback);
            }
        
        } else callback(null, data);
    };
};
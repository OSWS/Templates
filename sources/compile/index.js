// Universal compiler.

module.exports = function(exports) {
    
    var async = require('async');
    
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
    
    			async.each(Object.keys(data), function(key, next) {
    				exports.compile(data[key], context, function(error, value) {
    				    if (error) callback(error);
    					else {
    					    result[key] = value;
        					next();
    					}
    				}, context);
    			}, function() {
    				callback(null, result);
    			});
            }
        
        } else callback(null, data);
    };
};
// Asynchronously returned data.

module.exports = function(exports) {
    
    // (argument: (callback: (error, result) => void) => void) => { [Function] .___oswstAsync: true };
    exports.async = function(argument) {
        var async = function(callback) {
            if (callback) {
                var called = false;
                argument(function(error, result) {
                    if (!called) {
                        called = true;
                        if (typeof(callback) == 'function') callback(error, result);
                    } else throw new Error('Repeated call callback unexpected!');
                });
            } else return async.toString();
        };
        async.___oswstAsync = true;
    	async.toString = function() {
    	    var result = new Error('Asynchrony can not be converted into synchronicity!');
    	    async(function(error, data) {
    	        if (error) result = error;
    	        else result = data;
    	    });
    	    if (typeof(result) == 'object' && result instanceof Error) throw result;
    	    return String(result);
    	};
    	return async;
    };
    
    // (argument: Function) => boolean;
    exports.isAsyncFunction = function(argument) {
        return !!argument.___oswstAsync;
    };
};
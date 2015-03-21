// Asynchronously returned data on compile.

// Example:
/*
var example = async(function(context, callback) { callback(null, context.a); });
compile(example, { a: 123 }, function(error, result) {
    result // 123;
});
*/

module.exports = function(exports) {

// [new] (action: function) => this;
exports.async = exports.Node().extend(function() {
    // function;
    // this._action = undefined;
    
    this.__constructor = function(action) {
        this._action = action;
    };
    
    // Unsafe compile method.
    // (context: TContext, path: Array<TData>, callback: TCallback) => this;
    this.__compile = function(compilation, callback) {
        var called = false;
        this._action(compilation, function(error, result) {
            if (!called) {
                called = true;
                if (error) callback(error);
                else callback(null, result);
            } else throw new Error('Repeated call callback unexpected!');
        });
    }
});

};

// var async = function(argument) {
//     var async = function oswsAsync(context, callback) {
//         if (callback && typeof(callback) == 'function') {
//             var called = false;
//             argument(context, function(error, result) {
//                 if (!called) {
//                     called = true;
//                     if (error) callback(error);
//                     else callback(null, result);
//                 } else throw new Error('Repeated call callback unexpected!');
//             });
//         } else {
//             var result = new Error('Asynchrony can not be converted into synchronicity!');
//             async(context, function(error, data) {
//                 if (error) result = error;
//                 else result = data;
//             });
//             if (typeof(result) == 'object' && result instanceof Error) throw result;
//             return result;
//         }
//     };
//     async.toString = function() {
// 	    return require('../compile').compileSync(async, {});
//     };
//     return async;
// };

// exports.async = async;
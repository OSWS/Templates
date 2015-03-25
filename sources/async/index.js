// Asynchronously returned data on compile.

// Example:
/*
var example = async(function(context, callback) { callback(null, context.a); });
compile(example, { a: 123 }, function(error, result) {
    result // 123;
});
*/

// TAsync = (context: TContext, callback: TCallback) => void;

module.exports = function(exports) {

// [new] (action: TAsync) => this;
exports.async = exports.Node().extend(function() {
    
    // TAsync;
    // this._action = undefined;
    
    this.__constructor = function(action) {
        this._action = action;
    };
    
    // Unsafe compile method.
    // (compilation: Compilation, callback: TCallback) => void;
    this.__compile = function(compilation, callback) {
        var called = false;
        this._action.call(this, compilation, function(error, result) {
            if (!called) {
                called = true;
                if (error) callback(error);
                else callback(null, result);
            } else throw new Error('Repeated call callback unexpected!');
        });
    }
});

};
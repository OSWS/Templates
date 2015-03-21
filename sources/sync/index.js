// Synchronously returned data on compile.

// Example:
/*
var example = sync(function(context) { return context.a; });
compile(example, { a: 123 }, function(error, result) {
    result // 123;
});
*/

module.exports = function(exports) {

// [new] (action: function) => this;
exports.sync = exports.Node().extend(function() {
    // function;
    // this._action = undefined;
    
    this.__constructor = function(action) {
        this._action = action;
    };
    
    // Unsafe compile method.
    // (compilation: Compilation) => this;
    this.__compile = function(compilation) {
        return this._action.call(this, compilation);
    }
});

};
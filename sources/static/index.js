// Support static options to the class system.
// Add to extend.

// Example:
/*
var First = (new Class()).extend(function() {
    var prototype = this.___prototype;
    this.a = function(b) {
        return b;
    };
    this.extend = function() {
        var extension = prototype.extend.apply(this, arguments);
        __static(extension, 'a');
    };
})().extend();
First.a(123); // 123;
*/

module.exports = function(exports) {

// (extension: Function, key: string) => void;
exports.__static = function(extension, key) {
    extension[key] = function() {
        var instance = extension.__construct.call(this);
        return instance[key].apply(instance, arguments);
    };
};

};
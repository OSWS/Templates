// Support static options to the class system.

module.exports = function(exports) {
    
    // (extension: Function, key: string) => void;
    exports.static = function(extension, key) {
        extension[key] = function() {
            var instance = extension.__construct.call(this);
            return instance[key].apply(instance, arguments);
        };
    };
    
};
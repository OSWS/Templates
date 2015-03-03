// Synchronously returned data.

module.exports = function(exports) {
    
    // (argument: () => any) => { [Function] .___oswstSync: true };
    exports.sync = function(argument) {
        var sync = function() { return argument.apply(this); };
        sync.___oswstSync = true;
        sync.toString = function() {
            return String(sync.apply(this));
        };
        return sync;
    };
    
    // (argument: Function) => boolean;
    exports.isSyncFunction = function(argument) {
        return !!argument.___oswstSync;
    };
};
(function() {

// (argument: Function) => Function;
// unsafe
T.sync = function(argument) {
    var sync = function() { return argument(); };
	sync.__templatesSync = true;
	sync.toString = function() {
	    return sync();
	};
	return sync;
};

// (argument: any) => boolean;
T.isSyncFunction = function(argument) {
    return !!argument.__templatesSync;
};

})();
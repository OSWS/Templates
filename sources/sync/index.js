(function() {

// Wrap function. Says how perform this function to get the result.
// (argument: () => any) => Function;
T.sync = function(argument) {
    var sync = function() { return argument(); };
	sync.__templatesSync = true;
	sync.toString = function() {
	    var _result = new Error('Asynchrony can not be converted into synchronicity!');
        T.render(sync, function(error, result) {
	        if (error) throw error;
            else _result = result;
        }, {});
	    if (_.isObject(_result) && _result instanceof Error) throw _result;
	    return _result;
	};
	return sync;
};

// (argument: Function) => boolean;
T.isSyncFunction = function(argument) {
    return !!argument.__templatesSync;
};

})();
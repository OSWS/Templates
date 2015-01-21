// data ≈ Prototype|SyncFunction|AsyncFunction|stringify

// (argument: ay|?() => any) => boolean
var isSync = exports.isSync = function(argument) { return _.isFunction(argument) && argument.length == 0; };

// (argument: any|?(callback) => any) => boolean
var isAsync = exports.isAsync = function(argument) { return _.isFunction(argument) && argument.length > 0; };

// (data: data, callback: (result) => void) => void
var dataRender = exports.dataRender = function(data, callback) {
	if (isSync(data)) callback(data());
	else if (isAsync(data)) data(callback);
	else if (_.isObject(data) && data instanceof Prototype) data._render(callback);
	else callback(data);
};

// (data: Object, result: Object, callback: (result: string[]) => void) => void
var renderObjectData = exports.renderObjectData = function(data, result, callback) {
	var keys = _.keys(data);
	async.each(keys, function(key, next) {
		dataRender(data[key], function(string) {
			result[key] = string;
			next();
		});
	}, function() {
		callback(result);
	});
}

// (hash: data[], callback: (result: string[]) => void) => void
var renderArrayData = exports.renderArrayData = function(hash, callback) {
	renderObjectData(hash, [], callback);
}

// (hash: [name: string]: data, callback: (result: [name: string]: string) => void) => void
var renderHashData = exports.renderHashData = function(hash, callback) {
	renderObjectData(hash, {}, callback);
}

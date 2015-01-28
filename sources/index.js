// (argument: any) => boolean;
var isSync = exports.isSync = function(argument) { return _.isFunction(argument) && !!argument.__templatesSync; };

// (argument: any) => boolean;
var isAsync = exports.isAsync = function(argument) { return _.isFunction(argument) && !!argument.__templatesAsync; };

// (argument: Function) => Function;
var asSync = exports.asSync = function(argument) {
	if (_.isFunction(argument)) argument.__templatesSync = true;
	return argument;
};

// (argument: Function) => Function;
var asAsync = exports.asAsync = function(argument) {
	if (_.isFunction(argument)) argument.__templatesAsync = true;
	return argument;
};

// (instance: Prototype, callback: TCallback, context: Object) => void
var dataRenderInstance = function(instance, callback, context) {
	instance._render(callback, context);
};

// (data: TData, callback: TCallback, context: Object) => void;
var dataRender = exports.dataRender = function(data, callback, context) {
	if (_.isFunction(data)) {
		if (data.prototype instanceof Content) {
			if (data.prototype instanceof Double) dataRenderInstance(data()(), callback, context);
			else dataRenderInstance(data(), callback, context);
		} else if (data.__templatesInstance instanceof Content) dataRenderInstance(data.__templatesInstance, callback, context);
		else if (data.__templatesAsync) data(function(result) { dataRender(result, callback, context); });
		else if (data.__templatesSync) dataRender(data(), callback, context);
		else callback(data);
	} else if (_.isObject(data)) {
		
		if (data instanceof Content) dataRenderInstance(data, callback, context);
		else {
					
			var result;
			
			// typeof data?
			if (_.isArray(data)) result = [];
			else result = {};

			var keys = _.keys(data);

			async.each(keys, function(key, next) {
				dataRender(data[key], function(value) {
					result[key] = value;
					next();
				}, context);
			}, function() {
				callback(result);
			});
		}

	} else callback(data);
};

// (instance: Prototype, method: Function) => Function;
var wrapMethod = exports.wrapMethod = function(instance, method) {
	method.__templatesInstance = instance;
	return method;
};

// (data: string, reg: RegExp) => string[][];
var regExpSearch = exports.regExpSearch = function(data, reg) {
	var result = [], temp = null;
	while ((temp = reg.exec(data)) != null) {
		if (temp.index === reg.lastIndex) reg.lastIndex++;
		result.push(temp);
	}
	return result;
}

// https://www.regex101.com/r/cM5jC6/9
var _selectorRegExp = exports._selectorRegExp = (/(\[)|(\])|#([-\w\d]+)|\.([-\w\d]+)|([\w\d-]+)="(['\w\d\s-:\\\/\.\,\]\[={}<>%@#$%^&*~`]*)"|([\w\d-]+)='(["\w\d\s-:\\\/\.\,\]\[={}<>%@#$%^&*~`]*)'|([\w\d-]+)=([\w\d-:\\\/\.={}<>%@#$%^&*~`]*)|("['\w\d\s-:\\\/\.\,\]\[={}<>%@#$%^&*~`]+")|('["\w\d\s-:\\\/\.\,\]\[={}<>%@#$%^&*~`]+')|([_\w-:\\\/]+)/g);

// (_attributes: IAttributes, selector: TSelector) => void;
var parseSelector = exports.parseSelector = function(_attributes, selector) {
	var matchs = regExpSearch(selector, _selectorRegExp);
	var isAttr = false;
	_.each(matchs, function(node) {
		if (node[1]) { isAttr = true; return; } // [
		else if (node[2]) { isAttr = false; return; } // ]

		if (isAttr) {
			if (node[9]) { _attributes[node[9]] = node[10]; return; } // attr=value
			if (node[7]) { _attributes[node[7]] = node[8]; return; } // attr='value'
			if (node[5]) { _attributes[node[5]] = node[6]; return; } // attr="value"
			if (node[13]) { _attributes[node[13]] = null; return; } // [attr]
			if (node[12]) { _attributes[node[12]] = null; return; } // ['attr']
			if (node[11]) { _attributes[node[11]] = null; return; } // ["attr"]
		} else {
			if (node[3]) { _attributes.id = node[3]; return; } // id
			if (node[4]) { _attributes.class? _attributes.class += ' ' + node[4] : _attributes.class = node[4]; return; } // class
		}
	});
};

// (string: string, context: Object, callback: TCallback) => void;
var _stringTemplate = exports._stringTemplate = function(string, context, callback) {
	callback(_.template(string, context));
};
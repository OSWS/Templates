define(['exports', 'lodash', 'async'], function(exports, _, async) {

// (data: string, reg: RegExp) => string[][]
var regExpSearch = exports.regExpSearch = function(data, reg) {
	var result = [], temp = null;
	while ((temp = reg.exec(data)) != null) {
		if (temp.index === reg.lastIndex) reg.lastIndex++;
		result.push(temp);
	}
	return result;
}

// https://www.regex101.com/r/cM5jC6/9
var selectorRegExp = exports.selectorRegExp = (/(\[)|(\])|#([-\w\d]+)|\.([-\w\d]+)|([\w\d-]+)="(['\w\d\s-:\\\/\.\,\]\[={}<>%@#$%^&*~`]*)"|([\w\d-]+)='(["\w\d\s-:\\\/\.\,\]\[={}<>%@#$%^&*~`]*)'|([\w\d-]+)=([\w\d-:\\\/\.={}<>%@#$%^&*~`]*)|("['\w\d\s-:\\\/\.\,\]\[={}<>%@#$%^&*~`]+")|('["\w\d\s-:\\\/\.\,\]\[={}<>%@#$%^&*~`]+')|([_\w-:\\\/]+)/g);

// (data) => { [name: string]: string }
var parseSelector = exports.parseSelector = function(data) {
	var matchs = regExpSearch(data, selectorRegExp);
	var attributes = {};
	var isAttr = false;
	_.each(matchs, function(node) {
		if (node[1]) { isAttr = true; return; } // [
		else if (node[2]) { isAttr = false; return; } // ]

		if (isAttr) {
			if (node[9]) { attributes[node[9]] = node[10]; return; } // attr=value
			if (node[7]) { attributes[node[7]] = node[8]; return; } // attr='value'
			if (node[5]) { attributes[node[5]] = node[6]; return; } // attr="value"
			if (node[13]) { attributes[node[13]] = null; return; } // [attr]
			if (node[12]) { attributes[node[12]] = null; return; } // ['attr']
			if (node[11]) { attributes[node[11]] = null; return; } // ["attr"]
		} else {
			if (node[3]) { attributes.id = node[3]; return; } // id
			if (node[4]) { attributes.class? attributes.class += ' ' + node[4] : attributes.class = node[4]; return; } // class
		}
	});
	return attributes;
};

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

// new () => instance: Prototype
var Prototype = exports.Prototype = function() {

	// Prototype
	this._parent = null;
	// set at inheritance

	// data[]
	this._data = null;
	// set at construct

	// [name: string]: data
	this._context = null;
	// set at construct

	// (...context) => this
	this.context = function() {
		for (var a in arguments) {
			if (_.isObject(arguments[a])) _.merge(this._context, arguments[a]);
		}
		return this;
	};

	// (injector?: (parent: Prototype).call(instance: Prototype) => void) => instance: Prototype
	this.extend = function(injector) {
		var parent = this;

		var _arguments = undefined;
		
		function Element() {
			if (this instanceof Prototype) {
				var __arguments = _.isArguments(_arguments)? _arguments : arguments;

				this._parent = parent;
				this._arguments = __arguments;

				if (_.isFunction(injector)) injector.call(this, parent);
				if (_.isFunction(this.constructor)) this.constructor.apply(this, __arguments);

			} else {
				_arguments = arguments;
				var instance = new Element();
				return instance.returner(instance);
			}
		};

		Element.prototype = parent;

		return Element;
	};

	// ().call(instance: Prototype) => any
	this.returner = function() { return this; };

	// (...arguments: any[]).call(instance: Prototype) => any
	this.constructor = function() {
		this._data = [];
		this._context = {};
	};

	// (callback: (result: string) => void) => instance: Prototype
	this._render = function(callback) {
		renderArrayData(this._data, function(result) { callback(result.join('')); });
		return this;
	};

	// (callback: (result: string) => void, ...context) => instance: Prototype
	this.render = function(callback) {
		var instance = this;

		var contexts = Array.prototype.slice.call(arguments, 1);
		var context = _.merge({}, instance._context);
		for (var c in contexts) {
			if (_.isObject(contexts[c])) _.merge(context, contexts[c]);
		}

		this._render(function(result) {
			renderHashData(context, function(context) {
				callback(_.template(result, context));
			})
		});

		return this;
	};
};

// [new] () => instance: Contents > Prototype
var Contents = exports.Contents = (new Prototype()).extend(function(parent) {
	
	// data[][]
	this._contents = null;
	// set at inheritance

	// ([data]*, [context]*) => instance: Prototype
	this.prepend = function() {
		this._contents.unshift.apply(this._contents, arguments);
		return this;
	};

	// ([data]*, [context]*) => instance: Prototype
	this.content = function() {
		this._contents = Array.prototype.slice.call(arguments);
		return this;
	};

	// ([data]*, [context]*) => instance: Prototype
	this.append = function() {
		this._contents.push.apply(this._contents, arguments);
		return this;
	};

	// () => void
	this.generator = function() {
		var instance = this;
		this._data.push(function(callback) { renderArrayData(instance._contents, function(result) {
			callback(result.join(''));
		}); });
	};

	this.constructor = function() {
		parent.constructor.apply(this);
		this._contents = [];
		if (_.isArray(this._parent._contents)) this._contents.push.apply(this._contents, this._parent._contents);
		this.generator();
	};
});

// [new] ([selector: string]*, [attributes: attributes]*) => instance: Tag > Contents > Prototype
var Tag = exports.Tag = Contents().extend(function(parent) {
	
	// string
	this._name = null;
	// set at construct

	// (name: string) => this
	this.name = function(name) {
		this._name = name;
		return this;
	};

	// [name: string]: string
	this._attributes = null;
	// set at construct
	
	// ([attributes: [name: string]: string]) => void
	this._parseAttributes = function(attributes) {
		for (var key in attributes) {
			this._attributes[key] = attributes[key];
		}
		return this;
	};

	// ([selector: string]) => this
	this._parseSelector = function(selector) {
		this._parseAttributes(parseSelector(selector));
		return this;
	};

	// (...arguments: [attributes: [name: string]: string]*) => this
	this.parseAttributesArguments = function() {
		for (var a in arguments) {
			if (_.isObject(arguments[a])) this._parseAttributes(arguments[a]);
		}
		return this;
	};

	// (...arguments: [selector: string]*) => this
	this.parseSelectorArguments = function() {
		for (var a in arguments) {
			if (_.isString(arguments[a])) this._parseSelector(arguments[a]);
		}
		return this;
	};

	// (...arguments: [selector: string]*|[attributes: [name: string]: string]*) => this
	this.parseSelectorAndAttributesArguments = function() {
		for (var a in arguments) {
			if (_.isString(arguments[a])) this._parseSelector(arguments[a]);
			else if (_.isObject(arguments[a])) this._parseAttributes(arguments[a]);
		}
		return this;
	};

	// ([selector: string]*, [attributes: attributes]*) => instance: Prototype
	this.constructor = function() {
		parent.constructor.call(this);
		this._attributes = _.isObject(this._parent._attributes)? _.extend({}, this._parent._attributes) : {};
		this.parseSelectorAndAttributesArguments.apply(this, arguments);
	};
});

// [new] ([selector: string]*, [attributes: attributes]*) => instance: Single > Tag > Contents > Prototype
var Single = exports.Single = Tag().extend(function(parent) {
	this._quotesLeft = '<';
	this._quotesRight = '/>';

	this.generator = function() {
		var instance = this;

		this._data.push(this._quotesLeft);
		this._data.push(function(callback) { dataRender(instance._name, function(result) {
			callback(result);
		}); });
		this._data.push(function(callback) { renderArrayData(instance._attributes, function(attributes) {
			var result = '';
			for (var key in attributes) {
				if (_.isNull(attributes[key])) result += ' '+key;
				else result += ' '+key+'="'+attributes[key]+'"';
			}
			callback(result);
		}); });
		this._data.push(this._quotesRight);
	};
});

// [new] ([selector: string]*, [attributes: attributes]*) => .content([data]*) => instance: Double > Tag > Contents > Prototype
var Double = exports.Double = Tag().extend(function(parent) {
	this._quotesOpenLeft = '<';
	this._quotesOpenRight = '>';
	this._quotesCloseLeft = '</';
	this._quotesCloseRight = '>';

	this.generator = function() {
		var instance = this;

		this._data.push(this._quotesOpenLeft);
		this._data.push(function(callback) { dataRender(instance._name, function(result) {
			callback(result);
		}); });
		this._data.push(function(callback) { renderArrayData(instance._attributes, function(attributes) {
			var result = '';
			for (var key in attributes) {
				if (_.isNull(attributes[key])) result += ' '+key;
				else result += ' '+key+'="'+attributes[key]+'"';
			}
			callback(result);
		}); });
		this._data.push(this._quotesOpenRight);

		parent.generator.apply(this);

		this._data.push(this._quotesCloseLeft);
		this._data.push(function(callback) { dataRender(instance._name, function(result) {
			callback(result);
		}); });
		this._data.push(this._quotesCloseRight);
	};
	this.returner = function(instance) {
		return function() {
			if (arguments.length > 0) return instance.content.apply(instance, arguments);
			else return instance;
		};
	};
});

// [new] ([selector: string]*, [attributes: attributes]*) => instance: Doctype > Single > Tag > Contents > Prototype
var Doctype = exports.Doctype = Single().extend(function(parent) {
	this._name = 'DOCTYPE';
	this._quotesLeft = '<!';
	this._quotesRight = '>';
});

var doctype = exports.doctype = {};

doctype.html = Doctype('[html]').extend();
doctype.transitional = Doctype('[html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"]').extend();
doctype.strict = Doctype('[html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"').extend();
doctype.frameset = Doctype('[html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd"]').extend();
doctype.basic = Doctype('[html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd"]').extend();
doctype.mobile = Doctype('[html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd"]').extend();

var _single = exports._single = ['br', 'hr', 'img', 'input', 'base', 'frame', 'link', 'meta', 'style'];

var single = exports.single = {};

for (var key in _single) {
	single[_single[key]] = Single().name(_single[key]).extend();
}

var _double = exports._double = ['html', 'body', 'head', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hgroup', 'div', 'p', 'address', 'blockquote', 'pre', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'fieldset', 'legend', 'form', 'noscript', 'object', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'col', 'colgroup', 'caption', 'span', 'b', 'big', 'strong', 'i', 'var', 'cite', 'em', 'q', 'del', 's', 'strike', 'tt', 'code', 'kbd', 'samp', 'small', 'sub', 'sup', 'dfn', 'bdo', 'abbr', 'acronym', 'a', 'button', 'textarea', 'select', 'option', 'article', 'aside', 'figcaption', 'figure', 'footer', 'header', 'section', 'main', 'nav', 'menu', 'audio', 'video', 'embed', 'canvas', 'output', 'details', 'summary', 'mark', 'meter', 'progress', 'template', 'comment', 'title', 'script'];

var double = exports.double = {};

for (var key in _double) {
	double[_double[key]] = Double()().name(_double[key]).extend();
}

var content = exports.content = Contents().extend(function(parent) {
	this.constructor = function() {
		parent.constructor.apply(this);
		this.content.apply(this, arguments);
	};
});

});
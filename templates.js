define(['exports', 'lodash', 'async'], function(exports, _, async) {

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

// (data: TData, callback: TCallback) => void;
var dataRender = exports.dataRender = function(data, callback) {
	if (_.isFunction(data)) {
		if (data.prototype instanceof Content) {
			if (data.prototype instanceof Double) data()()._render(callback);
			else data()._render(callback);
		} else if (data.__templatesInstance instanceof Content) data.__templatesInstance._render(callback);
		else if (data.__templatesAsync) data(function(result) { dataRender(result, callback); });
		else if (data.__templatesSync) dataRender(data(), callback);
		else callback(data);
	} else if (_.isObject(data)) {

		if (data instanceof Content) data._render(callback);
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
				});
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
// new () => this;
var Prototype = exports.Prototype = function() {

	// Prototype;
	this._parent = undefined;

	// IArguments;
	this._arguments = undefined;

	// () => any;
	this.return = function() { return this; };

	// (...arguments: IArguments) => any;
	this.constructor = function() {};

	// (injector?: TInjector) => Function;
	this.extend = function(injector) {
		var parent = this;

		var _arguments = undefined;
		
		function Element() {
			if (this instanceof Prototype) {

				if(_.isArguments(_arguments)) {
					var __arguments = _arguments;
					_arguments = undefined;
				} else {
					var __arguments = arguments;
				}

				this._parent = parent;
				this._arguments = __arguments;

				if (_.isFunction(injector)) injector.call(this, parent);
				if (_.isFunction(this.constructor)) this.constructor.apply(this, __arguments);

			} else {
				_arguments = arguments;
				var instance = new Element();
				return instance.return(instance);
			}
		};

		Element.prototype = parent;

		return Element;
	};
};

// [new] () => this
var Content = exports.Content = (new Prototype()).extend(function(parent) {
	
	// Array<TData>;
	this._content = undefined;
	// set at inheritance

	// (...arguments: Array<TData>) => this;
	this.prepend = function() {
		this._content.unshift.apply(this._content, arguments);
		return this;
	};

	// (...arguments: Array<TData>) => this;
	this.content = function() {
		this._content = Array.prototype.slice.call(arguments);
		return this;
	};

	// (...arguments: Array<TData>) => this;
	this.append = function() {
		this._content.push.apply(this._content, arguments);
		return this;
	};

	// IContext;
	this._context = {};

	// (callback: TCallback, context?: IContext) => this;
	this.render = function(callback, _context) {
		var context = _.merge(this._context, _context);
		this._render(function(result) {
			_stringTemplate(result, context, callback);
		});
	};

	// (callback: TCallback) => this;
	this._render = function(callback) {
		dataRender(this._content, function(result) {
			callback(result.join(''));
		});
	};

	this.constructor = function() {
		parent.constructor.apply(this);
		this._content = [];
		if (_.isArray(this._parent._content)) this._content.push.apply(this._content, this._parent._content);
		this.context = {};
	};
});

var content = exports.content = Content().extend(function(parent) {
	this.constructor = function() {
		parent.constructor.apply(this);
		if (arguments.length > 0) this.content.apply(this, arguments);
	};
});

// [new] (...arguments: Array<TSelector|IAttributes>) => this;
var Tag = exports.Tag = Content().extend(function(parent) {
	
	// TData;
	this._name = null;

	// (name: TData) => this;
	this.name = function(name) {
		this._name = name;
		return this;
	};

	// IAttributes;
	this._attributes = null;
	
	// (attributes: IAttributes) => this;
	this.attributes = function(attributes) {
		_.extend(this._attributes, attributes);
		return this;
	};

	// (callback: TCallback) => void
	this.renderAttributes = function(callback) {
		dataRender(this._attributes, function(attributes) {
			var result = '';
			for (var key in attributes) {
				if (_.isNull(attributes[key])) result += ' '+key;
				else result += ' '+key+'="'+attributes[key]+'"';
			}
			callback(result);
		});
	};

	// (selector: TSelector) => this;
	this.selector = function(selector) {
		parseSelector(this._attributes, selector);
		return this;
	};

	this.constructor = function() {
		parent.constructor.call(this);
		this._attributes = _.isObject(this._parent._attributes)? _.extend({}, this._parent._attributes) : {};
		for (var a in arguments) {
			if (_.isString(arguments[a])) this.selector(arguments[a]);
			else this.attributes(arguments[a]);
		}
	};
});
// [new] (...arguments: Array<IAttributes|TSelector>) => this;
var Single = exports.Single = Tag().extend(function(parent) {

	// string;
	this._quotesLeft = '<';

	// string;
	this._quotesRight = '/>';

	// (callback: TCallback) => this;
	this._render = function(callback) {
		var instance = this;
		parent._render(function(result) {
			instance.renderAttributes(function(attributes) {
				callback(
instance._quotesLeft + instance._name + attributes + instance._quotesRight
				);
			});
		})
	};
});

// [new] (...arguments: Array<IAttributes|TSelector>) => .content => this;
var Double = exports.Double = Tag().extend(function(parent) {
	
	// string;
	this._quotesOpenLeft = '<';
	
	// string;
	this._quotesOpenRight = '>';
	
	// string;
	this._quotesCloseLeft = '</';
	
	// string;
	this._quotesCloseRight = '>';

	// () => any;
	this.return = function() {
		var instance = this;
		return wrapMethod(instance, function() {
			if (arguments.length > 0) return instance.content.apply(instance, arguments);
			else return instance;
		});
	};

	// (callback: TCallback) => this;
	this._render = function(callback) {
		var instance = this;
		parent._render.call(instance, function(result) {
			instance.renderAttributes(function(attributes) {
				callback(
instance._quotesOpenLeft + instance._name + attributes + instance._quotesOpenRight + result + instance._quotesCloseLeft + instance._name + instance._quotesCloseRight
				);
			});
		})
	};
});

// [new] (...arguments: Array<IAttributes|TSelector>) => this;
var Doctype = exports.Doctype = Tag().extend(function(parent) {
	
	// string;
	this._name = 'DOCTYPE';

	// string;
	this._quotesLeft = '<!';

	// string;
	this._quotesRight = '>';
	
	// (callback: TCallback) => this;
	this._render = function(callback) {
		var instance = this;
		parent._render(function(result) {
			instance.renderAttributes(function(attributes) {
				callback(
instance._quotesLeft + instance._name + attributes + instance._quotesRight
				);
			});
		})
	};
});

var doctypes = exports.doctypes = {};

doctypes.html = Doctype('[html]').extend();
doctypes.transitional = Doctype('[html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"]').extend();
doctypes.strict = Doctype('[html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"').extend();
doctypes.frameset = Doctype('[html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd"]').extend();
doctypes.basic = Doctype('[html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd"]').extend();
doctypes.mobile = Doctype('[html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd"]').extend();
var _singles = exports._singles = ['br', 'hr', 'img', 'input', 'base', 'frame', 'link', 'meta', 'style'];

var singles = exports.singles = {};

for (var key in _singles) {
	singles[_singles[key]] = Single().name(_singles[key]).extend();
}
var _doubles = exports._doubles = ['html', 'body', 'head', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hgroup', 'div', 'p', 'address', 'blockquote', 'pre', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'fieldset', 'legend', 'form', 'noscript', 'object', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'col', 'colgroup', 'caption', 'span', 'b', 'big', 'strong', 'i', 'var', 'cite', 'em', 'q', 'del', 's', 'strike', 'tt', 'code', 'kbd', 'samp', 'small', 'sub', 'sup', 'dfn', 'bdo', 'abbr', 'acronym', 'a', 'button', 'textarea', 'select', 'option', 'article', 'aside', 'figcaption', 'figure', 'footer', 'header', 'section', 'main', 'nav', 'menu', 'audio', 'video', 'embed', 'canvas', 'output', 'details', 'summary', 'mark', 'meter', 'progress', 'template', 'comment', 'title', 'script'];

var doubles = exports.doubles = {};

for (var key in _doubles) {
	doubles[_doubles[key]] = Double()().name(_doubles[key]).extend();
}
});
var _ = require('lodash');
var async = require('async');
var Queues = require('osws-queues');

/*
|
|   // Core string search method.
+-- RegExpSearch: (data: string, reg: RegExp) => string[][]
|
*/

var RegExpSearch = exports.RegExpSearch = function(data, reg) {
	var result = [], temp = null;
	while ((temp = reg.exec(data)) != null) {
		if (temp.index === reg.lastIndex) reg.lastIndex++;
		result.push(temp);
	}
	return result;
}


/*
|
|   // Example valid selector string: TagNeme.class.fdsaDss.pngClas-gfdreDS#Id1#Id2[attr1=http://google.com/images/logo.png,attr2='http://google.com/images/logo.png'][attr3=".com/images/logo.png",attr4]
+-- RegExpSearchSelector: (data) => string[][]
|
*/

var RegExpSearchSelectorRegExp = (/(\[)|(\])|^([-\w]+)|#([-\w]+)|\.([-\w]+)|([_a-zA-Z]+[\w-]+)="(['\w\s-:\\\/\.\,\]\[]*)"|([_a-zA-Z]+[\w-]+)='(["\w\s-:\\\/\.\,\]\[]*)'|([_a-zA-Z]+[\w-]+)=([_\w-:\\\/\.]*)|("['\w\s-:\\\/\.\,\]\[]+")|('["\w\s-:\\\/\.\,\]\[]+')|([_\w-:\\\/\.]*)/g);

var RegExpSearchSelector = exports.RegExpSearchSelector = function(data) {
	var matchs = RegExpSearch(data, RegExpSearchSelectorRegExp);
	var results = { name: undefined, attributes: { } };
	var isAttr = false;
	_.each(matchs, function(node) {
		if (node[1]) isAttr = true;
		else if (node[2]) isAttr = false;

		else if (isAttr) {
			if (node[10]) results.attributes[node[10]] = node[11];
			else if (node[14]) results.attributes[node[14]] = null;
			else if (node[13]) results.attributes[node[13]] = null;
			else if (node[12]) results.attributes[node[12]] = null;
			else if (node[8]) results.attributes[node[8]] = node[9];
			else if (node[6]) results.attributes[node[6]] = node[7];
		} else {
			if (node[3]) results.name = node[3];
			else if (node[4]) results.attributes.id = node[4];
			else if (node[5]) results.attributes.class? results.attributes.class += ' ' + node[5] : results.attributes.class = node[5];
		}
	});
	return results;
};


/*
|
|   // Any data to queues format.
+-- toQueuesFormat: (arg: string|Prototype|Queues.Queue|Queues.ISyncNode|Queues.IAsyncNode) => string|Queues.ISyncNode|Queues.IAsyncNode
|
*/

var toQueuesFormat = function(arg) {
	if (_.isString(arg)) return arg;
	else if (_.isFunction(arg)) {
		if (arg.prototype instanceof Prototype) {
			return function(callback) {
				arg.queue.renderAsync(function(error, result) {
					if (error) throw error;
					callback(result);
				});
			};
		} else return arg;
	} else if (_.isObject(arg)) {
		if (arg instanceof Prototype) {
			return function(callback) {
				arg.queue.renderAsync(function(error, result) {
					if (error) throw error;
					callback(result);
				});
			};
		} else if (arg instanceof Queues.Queue) {
			return function(callback) {
				arg.renderAsync(function(error, result) {
					if (error) throw error;
					callback(result);
				});
			};
		}
	}
	return undefined;
};


/*
|
|   // Method for filling a content data stream.
+-- QueueContent: (queue: Queues.Queue, args: Array<string|Prototype|Queues.Queue|Queues.ISyncNode|Queues.IAsyncNode>) => void
|
*/

var QueueContent = exports.QueueContent = function(queue, args) {
	_.each(args, function(arg) {
		var result = toQueuesFormat(arg);
		if (!_.isUndefined(result)) queue.add(result);
	});
};


/*
|
|   // Is not intended for final use! Only for core.
|   // This is the first and the last object that is created manually with `new`
|   // All of its expansion can be called without `new`
+-- Prototype: new () => instance: Prototype
|   |
|   +-- parent: Prototype
|   |
|   | // `injector` is not equal to `constructor`. `constructor` inherited, `injector` no.
|   | // The `constructor` and other class options are overridden in the `injector`.
|   +-- extend(injector: (parent: Prototype).call(instance: Prototype) => void) => instance: Prototype
|   |
|   | // That will return the call to the extended `Prototype`?
|   +-- returner: ().call(instance: Prototype) => any
|   | // For internal use only.
|   | // Can be overridden!
|   |
|   | // Inherited option causes each extension?
|   +-- constructor: ().call(instance: Prototype) => any
|   | // For internal use only.
|   | // Can be overridden!
|   |
|   | // Personal for each element Queues.Queue.
|   +-- queue: Queues.Queue
|   | // Can be overridden!
|   |
|   | // Nice Queues.Queue .renderAsync wrapper.
|   +-- render: (callback: Queues.IAsyncNode) => void
|   | // Can be overridden!
|
*/

// new () => instance: Prototype
var Prototype = exports.Prototype = function() {

	// Inheritance

	// Prototype
	this.parent = null;

	// (injector: (parent: Prototype).call(instance: Prototype) => void) => instance: Prototype
	this.extend = function(injector) {
		var parent = this;

		var _arguments = undefined;

		function Element() {
			if (this instanceof Prototype) {
				var __arguments = _.isArguments(_arguments)? _arguments : arguments;

				this.parent = parent;

				// Easy access to constructor arguments.
				this.arguments = __arguments;

				if (_.isFunction(injector)) injector.call(this, parent);

				// Checking to be able to complete overlap.
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
	this.returner = function() {
		return this;
	};
	// For internal use only.
	// Can be overridden!

	// (...arguments: any[]).call(instance: Prototype) => any
	this.constructor = function() {
		this.queue = new Queues.Queue();
	};
	// For internal use only.
	// Can be overridden!

	// Queues

	// Queues.Queue
	this.queue = undefined;
	// Can be overridden!

	// (callback: Queues.IAsyncNode) => void
	this.render = function(callback) {
		this.queue.renderAsync(function(error, result) {
			callback(error, result);
		});
	};
	// Can be overridden!
};


/*
|
|   // Control flow of renderer queues
+-- Flow: [new] () => instance: Prototype
|   |
|   | // Flow contents
|   +-- contents: Queues.Queue[]
|   |
|   | // Add contents flow to element queue
|   +-- generator: () => void
|   | // Can be overridden!
|   |
|   | // Add content into tag before exists content
|   +-- before: (...arguments: Array<selector:string|Prototype|Queues.Queue|Queues.ISyncNode|Queues.IAsyncNode>) => instance: Prototype
|   | // Can be overridden!
|   |
|   | // Add content into tag after exists content
|   +-- content: (...arguments: Array<selector:string|Prototype|Queues.Queue|Queues.ISyncNode|Queues.IAsyncNode>) => instance: Prototype
|   | // Can be overridden!
|   |
|   | // Equal to content
|   +-- after: (...arguments: Array<selector:string|Prototype|Queues.Queue|Queues.ISyncNode|Queues.IAsyncNode>) => instance: Prototype
|   | // Can be overridden!
|   |
|   | // extend the one-time inheritance
|   +-- inherit: () => constructor: Prototype
|   | // Can be overridden!
|
*/

var Flow = exports.Flow = (new Prototype()).extend(function(parent) {
	this.constructor = function() {
		parent.constructor.call(this);

		// Flow contents
		if (!_.has(this, 'contants')) this.contents = [];

		// Call generator to inset contents flow to queue
		this.generator();
	};

	// () => void
	this.generator = function() {
		var instance = this;
		instance.queue.addAsync(function(callback) {
			var result = '';
			async.each(instance.contents, function(queue, next) {
				queue.renderAsync(function(error, str) {
					result += str;
					next();
				});
			}, function() {
				callback(result);
			});
		});
	};
	// Can be overridden!

	// (...arguments: Array<selector:string|Prototype|Queues.Queue|Queues.ISyncNode|Queues.IAsyncNode>) => instance: Prototype
	this.before = function() {
		var queue = new Queues.Queue();
		QueueContent(queue, arguments);
		this.contents.unshift(queue);
		return this;
	};
	// Can be overridden!

	// (...arguments: Array<selector:string|Prototype|Queues.Queue|Queues.ISyncNode|Queues.IAsyncNode>) => instance: Prototype
	this.content = function() {
		var queue = new Queues.Queue();
		QueueContent(queue, arguments);
		this.contents.push(queue);
		return this;
	};
	// Can be overridden!

	// (...arguments: Array<selector:string|Prototype|Queues.Queue|Queues.ISyncNode|Queues.IAsyncNode>) => instance: Prototype
	this.after = function() {
		return this.content.apply(this, arguments);
	};
	// Can be overridden!

	this.inherit = function() {
		var instance = this.extend(function(parent) {
			this.constructor = function() {
				var instance = this;

				parent.constructor.apply(instance, arguments);

				_.once(function() {
					if (_.isArray(instance.parent.contents)) instance.contents.push.apply(instance.contents, instance.parent.contents);
				})();
			}
		});

		return instance;
	};
	// Can be overridden!

	// (handler: (content: selector:string|Queues.ISyncNode|Queues.IAsyncNode, indexes: number[]) => void)=> instance: Prototype
	this.each = function(handler) {
		_.each(this.contents, function(queue, contentIndex) {
			queue.each(function(node, nodeIndex){
				var result = toQueuesFormat(handler(node, [contentIndex, Number(nodeIndex)]));
				if (!_.isUndefined(result)) queue.set(nodeIndex, result);
			});
		});
		return this;
	};
	// Can be overridden!
});

/*
|
|   // A simple interface for transmitting data queues
+-- content: [new] (...arguments: Array<selector:string|Prototype|Queues.Queue|Queues.ISyncNode|Queues.IAsyncNode>) => instance: Prototype
|
*/

var content = exports.content = Flow().extend(function(parent) {
	this.constructor = function() {
		parent.constructor.call(this);
		this.content.apply(this, arguments);
	};
});


/*
|
|   // Tools for generatin double or single structures.
|   // Not ready for manual use! Only inheritance.
+-- Tag: [new] ([selector: string], [attributes: [name: string]: string]) => instance: Prototype
|   |
|   +-- parseAttributes: ([attributes: [name: string]: string]) => void
|   | // attributes priority: attributes > parent.attributes
|   |
|   | // Add new selectors
|   +-- attr: ([selector: string]) => instance: Prototype
|   | // Can be overridden!
|   |
|   | // Generate single/first double open tag quote
|   +-- _singleOpen: () => string
|   | // Can be overridden!
|   |
|   | // Generate second double open tag quote
|   +-- _doubleOpen: () => string
|   | // Can be overridden!
|   |
|   | // Generate close single tag quote
|   +-- _singleClose: () => string
|   | // Can be overridden!
|   |
|   | // Generate close double tag quote
|   +-- _doubleClose: () => string
|   | // Can be overridden!
|   |
|   | // Generate tag attributes
|   +-- _attr: () => string
|   | // Can be overridden!
|
*/

var Tag = exports.Tag = Flow().extend(function(parent) {

	this.constructor = function() {
		var instance = this;

		// instance.name = undefined; // Auto inherit from  prototype.
		instance.attributes = _.isObject(this.parent.attributes)? _.cloneDeep(this.parent.attributes) : {};

		// Parse arguments to inputs
		var selectors = [];
		var attributes = [];
		_.each(arguments, function(argument) {
			if (_.isString(argument)) selectors.push(argument);
			else if (_.isObject(argument)) attributes.push(argument);
		});

		instance.attr.apply(instance, selectors);
		instance.parseAttributes.apply(instance, attributes);

		parent.constructor.call(instance);
	};

	// Tags logic
	
	// ([attributes: [name: string]: string]) => void
	this.parseAttributes = function() {
		var instance = this;
		var parent = this.parent;

		_.each(arguments, function (attributes) {
			if (_.isObject(attributes)) _.each(attributes, function(value, key) {
				instance.attributes[key] = value;
			});
		})
	};

	// ([selector: string]) => isntance: Prototype
	this.attr = function() {
		var instance = this;

		// If attributes resetted
		if (!_.isObject(instance.attributes)) instance.attributes = {};

		_.each(arguments, function(selector) {
			if (_.isString(selector)) {
				var results = RegExpSearchSelector(selector);

				// Name only if name undefined...
				if (!_.isString(instance.name)) instance.name = results.name;

				_.each(results.attributes, function(value, key) {
					instance.attributes[key] = (key == 'class' && _.isString(results.attributes[key]) && _.isString(instance.attributes[key]))? instance.attributes[key] + ' ' + results.attributes[key] : results.attributes[key];
				});
			}
		});

		return this;
	};
	// Can be overridden!

	// () => string
	this._singleOpen = function() {
		return '<';
	};

	// () => string
	this._doubleOpen = function() {
		return '</';
	};
	// Can be overridden!

	// () => string
	this._singleClose = function() {
		return '/>';
	};
	// Can be overridden!

	// () => string
	this._doubleClose = function() {
		return '>';
	};
	// Can be overridden!

	// () => string
	this._attr = function() {
		var result = ''
		_.each(this.attributes, function(value, key) {
			if (_.isArray(value)) result += ' '+key+'="' + value.join(' ') + '"';
			else if (_.isString(value) || _.isNumber(value)) result += ' '+key+'="'+value+'"';
			else if(_.isNull(value)) result += ' '+key;
		});
		return result;
	};
	// Can be overridden!
});


/*
|
|   // Tool for single tags generating.
+-- Single: [new] ([selector: string], [attributes: [name: string]: string]) => instance: Prototype
|   |
|   | // Generate single tag structore from `_singleClose` `name` and `_close` options
|   +-- generator: () => void
|   | // Can be overridden!
|   |
|   | // Clear double tag variables inheritance.
|   |
|   +-- before = undefined
|   +-- content = undefined
|   +-- after = undefined
|
*/

var Single = exports.Single = Tag().extend(function(parent) {

	// () => void
	this.generator = function() {
		var instance = this;
		instance.queue.addSync(function() { return instance._singleOpen(); });
		instance.queue.addSync(function() {
			return instance.name;
		});
		instance.queue.addSync(function() { return instance._attr(); });
		instance.queue.addSync(function() { return instance._singleClose(); });
	};
	// Can be overridden!

	// Clear double tag variables inheritance.
	this.before = undefined;
	this.content = undefined;
	this.after = undefined;

});


/*
|
|   // Tool for double tags generating.
+-- Double: [new] ([selector: string], [attributes: [name: string]: string]) => instance.content
|   |
|   | // Double tag returns content method when creates
|   +-- returner: () => instance.content
|   // Can be overridden!
|
*/

var Double = exports.Double = Tag().extend(function(parent) {

	// () => void
	this.generator = function() {
		var instance = this;
		instance.queue.addSync(function() { return instance._singleOpen(); });
		instance.queue.addSync(function() {
			return instance.name;
		});
		instance.queue.addSync(function() { return instance._attr(); });
		instance.queue.addSync(function() { return instance._doubleClose(); });
		parent.generator.apply(this);
		instance.queue.addSync(function() { return instance._doubleOpen(); });
		instance.queue.addSync(function() {
			return instance.name;
		});
		instance.queue.addSync(function() { return instance._doubleClose(); });
	};
	// Can be overridden!

	// () => instance.content
	this.returner = function(instance) {
		return function(){ return instance.content.apply(instance, arguments); };
	}
	// Can be overridden!

});

// Tags

exports.tags = {};

var singleNames = exports.singleNames = ['br', 'hr', 'img', 'input', 'base', 'frame', 'link', 'meta'];

exports.single = {};

for (var key in singleNames) {
	exports.tags[singleNames[key]] = Single(singleNames[key]).extend();
	exports.single[singleNames[key]] = exports[singleNames[key]];
}

var doubleNames = exports.doubleNames = ['html', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hgroup', 'div', 'p', 'address', 'blockquote', 'pre', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'fieldset', 'legend', 'form', 'noscript', 'object', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'col', 'colgroup', 'caption', 'span', 'b', 'big', 'strong', 'i', 'var', 'cite', 'em', 'q', 'del', 's', 'strike', 'tt', 'code', 'kbd', 'samp', 'small', 'sub', 'sup', 'dfn', 'bdo', 'abbr', 'acronym', 'a', 'button', 'textarea', 'select', 'option', 'article', 'aside', 'figcaption', 'figure', 'footer', 'header', 'section', 'main', 'nav', 'menu', 'audio', 'video', 'embed', 'canvas', 'output', 'details', 'summary', 'mark', 'meter', 'progress', 'template', 'comment'];

exports.double = {};

for (var key in doubleNames) {
	exports.tags[doubleNames[key]] = Double(doubleNames[key])().extend();
	exports.double[doubleNames[key]] = exports[doubleNames[key]];
}

// Doctypes

var Doctype = exports.Doctype = Single('DOCTYPE').extend(function() {
	// () => string
	this._singleOpen = function() {
		return '<!';
	};
	// () => string
	this._singleClose = function() {
		return '>';
	};
});

exports.doctypes = {
	html: Doctype('[html]').extend(),
	xml: Doctype('[version="1.0" encoding="utf-8"]').extend(function() {
		this.name = 'xml';
		// () => string
		this._singleOpen = function() {
			return '<?';
		};
		// () => string
		this._singleClose = function() {
			return '?>';
		};
	}),
	transitional: Doctype('[html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"]').extend(),
	strict: Doctype('[html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"').extend(),
	frameset: Doctype('[html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd"]').extend(),
	basic: Doctype('[html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd"]').extend(),
	mobile: Doctype('[html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd"]').extend()
};
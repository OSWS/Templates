define(['exports', 'lodash', 'async', 'osws-renderer-ts'], function(exports, _, async, Renderer) {

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
|   // Example valid selector string: TagNeme.class.fdsaDss.pngClas-gfdreDS#Id1#Id2[attr1=http://google.com/images/logo.png,attr2='http://google.com/images/logo.png'][attr3=".com/images/logo.png"]
+-- RegExpSearchSelector: (data) => string[][]
|
*/

var RegExpSearchSelectorRegExp = (/(\[)|(\])|^([-\w]+)|#([-\w]+)|(\.([-\w]+)|([_a-zA-Z]+[\w-]+)="(['\w\s-:\\\/\.\,\]\[]*)"|([_a-zA-Z]+[\w-]+)='(["\w\s-:\\\/\.\,\]\[]*)'|([_a-zA-Z]+[\w-]+)=([_\w-:\\\/\.]*))/g);

var RegExpSearchSelector = exports.RegExpSearchSelector = function(data) {
	var matchs = RegExpSearch(data, RegExpSearchSelectorRegExp);
	var results = { name: undefined, attributes: { } };
	var isAttr = false;
	_.each(matchs, function(node) {
		if (node[1]) isAttr = true;
		else if (node[2]) isAttr = false;

		else if (isAttr) {
			if (node[11]) results.attributes[node[11]] = node[12];
			else if (node[9]) results.attributes[node[9]] = node[10];
			else if (node[7]) results.attributes[node[7]] = node[8];
		} else {
			if (node[3]) results.name = node[3];
			else if (node[4]) results.attributes.id = node[4];
			else if (node[6]) results.attributes.class? results.attributes.class += ' ' + node[6] : results.attributes.class = node[6];
		}
	});
	return results;
};


/*
|
|   // Method for filling a content data stream.
+-- QueueContent: (queue: Renderer.Queue, args: Array<selector:string|Prototype|Renderer.Queue|ISyncCallback|IAsyncCallback>) => void
|
*/

var QueueContent = exports.QueueContent = function(queue, args) {
	_.each(args, function(arg) {

		// string
		if (_.isString(arg)) {
			queue.addString(arg);

		// function
		} else if (_.isFunction(arg)) {

			// Prototype authomatic construction
			if (arg.prototype instanceof Prototype) {
				(function(arg) { queue.addAsync(function(callback) {
					arg.queue.renderAsync(function(error, result) {
						if (error) throw error;
						callback(result);
					});
				}); })(arg);

			// ISyncCallback | IAsyncCallback
			} else {
				if (arg.length > 0) (function(arg) { queue.addAsync(function(callback) { arg(callback); }); })(arg);
				else (function(arg) { queue.addSync(function() { return arg(); }); })(arg);
			}

		// object
		} else if (_.isObject(arg)) {

			// Prototype
			if (arg instanceof Prototype) {
				(function(arg) { queue.addAsync(function(callback) {
					arg.queue.renderAsync(function(error, result) {
						if (error) throw error;
						callback(result);
					});
				}); })(arg);

			// Renderer.Queue
			} else if (arg instanceof Renderer.Queue) {
				(function(arg) { queue.addAsync(function(callback) {
					arg.renderAsync(function(error, result) {
						if (error) throw error;
						callback(result);
					});
				}); })(arg);
			}
		}
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
|   | // Personal for each element Renderer.Queue.
|   +-- queue: Renderer.Queue
|   | // Can be overridden!
|   | // Override in `constructor`.
|   |
|   | // Nice Renderer.Queue .renderAsync wrapper.
|   +-- render: (callback: IAsyncCallback) => void
|   | // Can be overridden!
|   | // Override in `constructor`.
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

		var switcher = false;

		function Element(_arguments) {
			if (!switcher) {
				switcher = true;
				var instance = new Element(arguments);
				return instance.returner(instance);
			} else if (this instanceof Prototype) {
				switcher = false;
				this.parent = parent;

				// Easy access to constructor arguments
				this.arguments = _arguments;

				if (_.isFunction(injector)) injector.call(this, parent);

				// Checking to be able to complete overlap.
				if (_.isFunction(this.constructor)) this.constructor.apply(this, _arguments);
			} else throw new Error('unexpected');
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
		this.queue = new Renderer.Queue();
	};
	// For internal use only.
	// Can be overridden!

	// Queues

	// Renderer.Queue
	this.queue = undefined;
	// Can be overridden!
	// Override in `constructor`.

	// (callback: IAsyncCallback) => void
	this.render = function(callback) {
		this.queue.renderAsync(function(error, result) {
			callback(error, result);
		});
	};
	// Override in `constructor`.
	// Can be overridden!
};


/*
|
|   // Control flow of renderer queues
+-- Flow: [new] () => instance: Prototype
|   |
|   | // Flow contents
|   +-- contents: Renderer.Queue[]
|   |
|   | // Add contents flow to element queue
|   +-- generator: () => void
|   | // Override in `constructor`.
|   | // Can be overridden!
|   |
|   | // Add content into tag before exists content
|   +-- before: (...arguments: Array<selector:string|Prototype|Renderer.Queue|ISyncCallback|IAsyncCallback>) => instance: Prototype
|   | // Override in `constructor`.
|   | // Can be overridden!
|   |
|   | // Add content into tag after exists content
|   +-- content: (...arguments: Array<selector:string|Prototype|Renderer.Queue|ISyncCallback|IAsyncCallback>) => instance: Prototype
|   | // Override in `constructor`.
|   | // Can be overridden!
|   |
|   | // Equal to content
|   +-- after: (...arguments: Array<selector:string|Prototype|Renderer.Queue|ISyncCallback|IAsyncCallback>) => instance: Prototype
|   | // Override in `constructor`.
|   | // Can be overridden!
|   |
|   | // extend the one-time inheritance
|   +-- inherit: () => constructor: Prototype
|   | // Override in `constructor`.
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
	// Override in `constructor`.
	// Can be overridden!

	// (...arguments: Array<selector:string|Prototype|Renderer.Queue|ISyncCallback|IAsyncCallback>) => instance: Prototype
	this.before = function() {
		var queue = new Renderer.Queue();
		QueueContent(queue, arguments);
		this.contents.unhift(queue);
		return this;
	};
	// Override in `constructor`.
	// Can be overridden!

	// (...arguments: Array<selector:string|Prototype|Renderer.Queue|ISyncCallback|IAsyncCallback>) => instance: Prototype
	this.content = function() {
		var queue = new Renderer.Queue();
		QueueContent(queue, arguments);
		this.contents.push(queue);
		return this;
	};
	// Override in `constructor`.
	// Can be overridden!

	// (...arguments: Array<selector:string|Prototype|Renderer.Queue|ISyncCallback|IAsyncCallback>) => instance: Prototype
	this.after = function() {
		return this.content.apply(this, arguments);
	};
	// Override in `constructor`.
	// Can be overridden!

	this.inherit = function() {
		var instance = this.extend(function() {
			if (_.isArray(this.parent.contents)) this.contents.push.apply(this.contents, this.parent.contents);
		});

		return instance;
	};
	// Override in `constructor`.
	// Can be overridden!
});

/*
|
|   // A simple interface for transmitting data queues
+-- content: [new] (...arguments: Array<selector:string|Prototype|Renderer.Queue|ISyncCallback|IAsyncCallback>) => instance: Prototype
|   |
|   | // extend with content inheritance
|   +-- inherit: (...arguments: Array<selector:string|Prototype|Renderer.Queue|ISyncCallback|IAsyncCallback>) => constructor: Prototype
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
|   +-- parseSelectors: ([selector: string]) => void
|   | // name priority: parent.name > instance.name > selector
|   | // id priority: attributes > parent.attributes.id > instance.attributes.id > selector
|   | // class prioryty: instance.attributes.class + parent.attributes.class + selector
|   | // attributes priority: attributes > parent.attributes
|   |
|   +-- parseAttributes: ([attributes: [name: string]: string]) => void
|   | // attributes priority: attributes > parent.attributes
|   |
|   | // Generate single/first double open tag quote
|   +-- _singleOpen: () => string
|   | // Override in `constructor`.
|   | // Can be overridden!
|   |
|   | // Generate second double open tag quote
|   +-- _doubleOpen: () => string
|   | // Override in `constructor`.
|   | // Can be overridden!
|   |
|   | // Generate close single tag quote
|   +-- _singleClose: () => string
|   | // Override in `constructor`.
|   | // Can be overridden!
|   |
|   | // Generate close double tag quote
|   +-- _doubleClose: () => string
|   | // Override in `constructor`.
|   | // Can be overridden!
|   |
|   | // Generate tag attributes
|   +-- _attr: () => string
|   | // Override in `constructor`.
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

		instance.parseSelectors.apply(instance, selectors);
		instance.parseAttributes.apply(instance, attributes);

		parent.constructor.call(instance);
	};

	// Tags logic
	
	// ([selector: string]) => void
	this.parseSelectors = function() {
		var instance = this;
		var parent = this.parent;

		// If attributes resetted
		if (!_.isObject(instance.attributes)) instance.attributes = {};

		if (parent.attributes) {
			// id
			instance.attributes.id = _.isString(parent.attributes.id)? parent.attributes.id : undefined;

			// class
			instance.attributes.class = _.isString(parent.attributes.class)? parent.attributes.class : undefined;
		}

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
	};
	
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

	// () => string
	this._singleOpen = function() {
		return '<';
	};

	// () => string
	this._doubleOpen = function() {
		return '</';
	};
	// Override in `constructor`.
	// Can be overridden!

	// () => string
	this._singleClose = function() {
		return '/>';
	};
	// Override in `constructor`.
	// Can be overridden!

	// () => string
	this._doubleClose = function() {
		return '>';
	};
	// Override in `constructor`.
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
	// Override in `constructor`.
	// Can be overridden!
});


/*
|
|   // Tool for single tags generating.
+-- Single: [new] ([selector: string], [attributes: [name: string]: string]) => instance: Prototype
|   |
|   | // Generate single tag structore from `_singleClose` `name` and `_close` options
|   +-- generator: () => void
|   | // Override in `constructor`.
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
	// Override in `constructor`.
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
|   // Override in `constructor`.
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
	// Override in `constructor`.
	// Can be overridden!

	// () => instance.content
	this.returner = function(instance) {
		return function(){ return instance.content.apply(instance, arguments); };
	}
	// Override in `constructor`.
	// Can be overridden!

});


// Tags

var _single = exports._single = ['br', 'hr', 'img', 'input', 'base', 'frame', 'link', 'meta'];

var _double = exports._double = ['html', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hgroup', 'div', 'p', 'address', 'blockquote', 'pre', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'fieldset', 'legend', 'form', 'noscript', 'object', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'col', 'colgroup', 'caption', 'span', 'b', 'big', 'strong', 'i', 'var', 'cite', 'em', 'q', 'del', 's', 'strike', 'tt', 'code', 'kbd', 'samp', 'small', 'sub', 'sup', 'dfn', 'bdo', 'abbr', 'acronym', 'a', 'button', 'textarea', 'select', 'option', 'article', 'aside', 'figcaption', 'figure', 'footer', 'header', 'section', 'main', 'nav', 'menu', 'audio', 'video', 'embed', 'canvas', 'output', 'details', 'summary', 'mark', 'meter', 'progress', 'template', 'comment'];

var tags = exports.tags = {};
var single = exports.single = {};
var double = exports.double = {};

(function(){
	_.each(_double, function(name) {
		tags[name] = Double(name)().extend();
		double[name] = tags[name];
		exports[name] = tags[name];
	});
	_.each(_single, function(name) {
		tags[name] = Single(name).extend();
		single[name] = tags[name];
		exports[name] = tags[name];
	});
})();

});
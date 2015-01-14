define(['exports', 'lodash', 'async', 'osws-renderer-ts'], function(exports, _, async, Renderer) {

	/*
	|
	|	// Core string search method.
	+--	RegExpSearch: (data: string, reg: RegExp) => string[][]
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
	|	// Example valid selector string: tag.container#FirstId[data-num=123,alt="text"]
	+--	RegExpSearchSelector
	|	+--	name: (selector: string) => string
	|	+--	id: (selector: string) => string
	|	+--	classes: (selector: string) => string[]
	|	+--	attributes: (selector: string) => [name: string]: string
	|
	*/

	var RegExpSearchSelector = exports.RegExpSearchSelector = {

		// (selector: string) => string
		name: function(selector) {
			var founded = RegExpSearch(selector, (/^([_a-zA-Z]+[_\w-]*)/g));
			return founded[0]? founded[0][1] : undefined;
		},

		// (selector: string) => string
		id: function(selector) {
			var founded = RegExpSearch(selector, (/#([_a-zA-Z]+[_\w-]*)/g));
			return founded[0]? founded[0][1] : undefined;
		},
		
		// (selector: string) => string[]
		classes: function(selector) {
			var result = [];
			_.each(RegExpSearch(selector, (/\.([_a-zA-Z]+[_\w-]*)/g)), function (node) { result.push(node[1]); });
			return result;
		},
		
		// (selector: string) => [name: string]: string
		attributes: function(selector) {
			var result = {};
			// [key=value]
			_.each(RegExpSearch(selector, (/[\[,]*([_a-zA-Z]+[_\w-]+)=([_\w-:\\\/\.]+)[\],]*/g)), function (node) { result[node[1]] = node[2]; });
			// [key="valu  213 21, gfd: sdf se"]
			_.each(RegExpSearch(selector, (/[\[,]*([_a-zA-Z]+[_\w-]+)="(['_\w\s-:\\\/\.\,]*)"[\],]*/g)), function (node) { result[node[1]] = node[2]; });
			// [key='valu  213 21, gfd: sdf se']
			_.each(RegExpSearch(selector, (/[\[,]*([_a-zA-Z]+[_\w-]+)='(["_\w\s-:\\\/\.\,]*)'[\],]*/g)), function (node) { result[node[1]] = node[2]; });
			return result;
		},

	};


	/*
	|
	|	// Method for filling a content data stream.
	+--	QueueContent: (queue: Renderer.Queue, args: Array<selector:string|Prototype|Renderer.Queue|ISyncCallback|IAsyncCallback>) => void
	|
	*/

	var QueueContent = exports.QueueContent = function(queue, args) {
		_.each(args, function(arg) {

			// string
			if (_.isString(arg)) {
				queue.addString(arg);

			// function
			} else if (_.isFunction(arg)) {

				// Prototype
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
	|	// Is not intended for final use! Only for core.
	|	// This is the first and the last object that is created manually with `new`
	|	// All of its expansion can be called without `new`
	+--	Prototype: new () => instance: Prototype
	|	|
	|	+--	parent: Prototype
	|	|
	|	|	// `injector` is not equal to `constructor`. `constructor` inherited, `injector` no.
	|	|	// The `constructor` and other class options are overridden in the `injector`.
	|	+--	extend: (injector: (parent: Prototype).call(instance: Prototype) => void) => instance: Prototype
	|	|
	|	|	// That will return the call to the extended `Prototype`?
	|	+--	returner: ().call(instance: Prototype) => any
	|	|	// For internal use only.
	|	|	// Can be overridden!
	|	|
	|	|	// Inherited option causes each extension?
	|	+--	constructor: ().call(instance: Prototype) => any
	|	|	// For internal use only.
	|	|	// Can be overridden!
	|	|
	|	|	// Personal for each element Renderer.Queue.
	|	+--	queue: Renderer.Queue
	|	|	// Can be overridden!
	|	|	// Override in `constructor`.
	|	|
	|	|	// Nice Renderer.Queue .renderAsync wrapper.
	|	+--	render: (callback: IAsyncCallback) => void
	|	|	// Can be overridden!
	|	|	// Override in `constructor`.
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
	|	// A simple interface for transmitting data queues
	+--	content: [new] (...arguments: Array<selector:string|Prototype|Renderer.Queue|ISyncCallback|IAsyncCallback>) => instance: Prototype
	|
	*/

	var content = exports.content = (new Prototype()).extend(function(parent) {
		this.constructor = function() {
			parent.constructor.call(this);
			QueueContent(this.queue, arguments);
		};
	});


	/*
	|
	|	// Tools for generatin double or single structures.
	+--	Tag: [new] ([selector: string], [attributes: [name: string]: string]) => instance: Prototype
	|	|
	|	+--	parseSelectors: ([selector: string]) => void
	|	|	// name priority: parent.name > instance.name > selector
	|	|	// id priority: attributes > parent.attributes.id > instance.attributes.id > selector
	|	|	// class prioryty: instance.attributes.class + parent.attributes.class + selector
	|	|	// attributes priority: attributes > parent.attributes
	|	|
	|	+--	parseAttributes: ([attributes: [name: string]: string]) => void
	|	|	// attributes priority: attributes > parent.attributes
	|	|
	|	|	// Generate single/first double open tag quote
	|	+--	_singleOpen: () => string
	|	|	// Override in `constructor`.
	|	|	// Can be overridden!
	|	|
	|	|	// Generate second double open tag quote
	|	+--	_doubleOpen: () => string
	|	|	// Override in `constructor`.
	|	|	// Can be overridden!
	|	|
	|	|	// Generate close single tag quote
	|	+--	_singleClose: () => string
	|	|	// Override in `constructor`.
	|	|	// Can be overridden!
	|	|
	|	|	// Generate close double tag quote
	|	+--	_doubleClose: () => string
	|	|	// Override in `constructor`.
	|	|	// Can be overridden!
	|	|
	|	|	// Generate tag attributes
	|	+--	_attr: () => string
	|	|	// Override in `constructor`.
	|	|	// Can be overridden!
	|
	*/

	var Tag = exports.Tag = (new Prototype()).extend(function(parent) {

		this.constructor = function() {
			var instance = this;

			// Parse name
			instance.name = null;
			instance.attributes = { class: [] };

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

			instance.name = _.isString(parent.name)? parent.name : _.isString(instance.name)? instance.name : null;

			if (!_.isObject(instance.attributes)) instance.attributes = {};

			if (!_.has(instance.attributes, 'id')) instance.attributes.id = undefined;

			instance.attributes.id = parent.attributes && _.isString(parent.attributes.id)? parent.attributes.id : _.isString(instance.attributes.id)? instance.attributes.id : undefined;

			if (!_.isArray(instance.attributes.class)) instance.attributes.class = _.isString(instance.attributes.class)? instance.attributes.class.split(' ') : [];
			if (parent.attributes) instance.attributes.class.push.apply(instance.attributes.class, _.isString(parent.attributes.class)? parent.attributes.class.split(' ') : _.isArray(parent.attributes.class)? parent.attributes.class : []);

			_.each(arguments, function(selector) { if (_.isString(selector)) {
				if (!_.isString(instance.name)) instance.name = RegExpSearchSelector.name(selector);
				instance.attributes.id = RegExpSearchSelector.id(selector);
				instance.attributes.class.push.apply(instance.attributes.class, RegExpSearchSelector.classes(selector));
				_.each(RegExpSearchSelector.attributes(selector), function(value, key) {
					instance.attributes[key] = value;
				});
			} });
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
				if (_.isString(value) || _.isNumber(value)) result += ' '+key+'="'+value+'"';
				else if(_.isNull(value)) result += ' '+key;
			});
			return result;
		};
		// Override in `constructor`.
		// Can be overridden!
	});


	/*
	|
	|	// Tool for single tags generating.
	+--	Single: [new] ([selector: string], [attributes: [name: string]: string]) => instance: Prototype
	|	|
	|	|	// Generate single tag structore from `_singleClose` `name` and `_close` options
	|	+--	generator: () => void
	|	|	// Override in `constructor`.
	|	|	// Can be overridden!
	|
	*/

	var Single = exports.Single = Tag().extend(function(parent) {

		this.constructor = function() {
			parent.constructor.apply(this, arguments);
			this.generator();
		};

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

	});


	/*
	|
	|	// Tool for double tags generating.
	+--	Double: [new] ([selector: string], [attributes: [name: string]: string]) => instance.content
	|	|
	|	|	// Double tag contents
	|	+--	contents: Renderer.Queue[]
	|	|
	|	|	// Double tag returns content method when creates
	|	+--	returner: () => instance.content
	|	|	// Override in `constructor`.
	|	|	// Can be overridden!
	|	|
	|	|	// Generate double tag structore
	|	+--	generator: () => void
	|	|	// Override in `constructor`.
	|	|	// Can be overridden!
	|	|
	|	|	// Add content into tag after exists content
	|	+--	content: (...arguments: Array<selector:string|Prototype|Renderer.Queue|ISyncCallback|IAsyncCallback>) => instance: Prototype
	|	|	// Override in `constructor`.
	|	|	// Can be overridden!
	|	|
	|	|	// Equal to content
	|	+--	after: (...arguments: Array<selector:string|Prototype|Renderer.Queue|ISyncCallback|IAsyncCallback>) => instance: Prototype
	|	|	// Override in `constructor`.
	|	|	// Can be overridden!
	|	|
	|	|	// Add content into tag before exists content
	|	+--	before: (...arguments: Array<selector:string|Prototype|Renderer.Queue|ISyncCallback|IAsyncCallback>) => instance: Prototype
	|		// Override in `constructor`.
	|		// Can be overridden!
	|
	*/

	var Double = exports.Double = Tag().extend(function(parent) {

		this.constructor = function() {
			this.contents = [];
			// inheritance
			if (_.isArray(this.parent.contents)) this.contents.push.apply(this.contents, this.parent.contents);

			parent.constructor.apply(this, arguments);

			this.generator();
		};

		this.returner = function(instance) {
			return function(){ return instance.content.apply(instance, arguments); };
		}
		// Override in `constructor`.
		// Can be overridden!

		// () => void
		this.generator = function() {
			var instance = this;
			instance.queue.addSync(function() { return instance._singleOpen(); });
			instance.queue.addSync(function() {
				return instance.name;
			});
			instance.queue.addSync(function() { return instance._attr(); });
			instance.queue.addSync(function() { return instance._doubleClose(); });
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
			instance.queue.addSync(function() { return instance._doubleOpen(); });
			instance.queue.addSync(function() {
				return instance.name;
			});
			instance.queue.addSync(function() { return instance._doubleClose(); });
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
		this.before = function() {
			var queue = new Renderer.Queue();
			QueueContent(queue, arguments);
			this.contents.unhift(queue);
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

	});


	// Tags

	var _double = exports._double = ['html', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hgroup', 'div', 'p', 'address', 'blockquote', 'pre', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'fieldset', 'legend', 'form', 'noscript', 'object', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'col', 'colgroup', 'caption', 'span', 'b', 'big', 'strong', 'i', 'var', 'cite', 'em', 'q', 'del', 's', 'strike', 'tt', 'code', 'kbd', 'samp', 'small', 'sub', 'sup', 'dfn', 'bdo', 'abbr', 'acronym', 'a', 'button', 'textarea', 'select', 'option', 'article', 'aside', 'figcaption', 'figure', 'footer', 'header', 'section', 'main', 'nav', 'menu', 'audio', 'video', 'embed', 'canvas', 'output', 'details', 'summary', 'mark', 'meter', 'progress', 'template', 'comment'];

	var _single = exports._single = ['br', 'hr', 'img', 'input', 'base', 'frame', 'link', 'meta'];

	var tags = exports.tags = {};
	var double = exports.double = {};
	var single = exports.single = {};

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
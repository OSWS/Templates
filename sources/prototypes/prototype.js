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

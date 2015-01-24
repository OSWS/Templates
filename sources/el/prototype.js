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

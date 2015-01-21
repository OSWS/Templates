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

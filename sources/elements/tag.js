// [new] (...arguments: Array<TSelector|IAttributes>) => this;
var Tag = exports.Tag = Content().extend(function() {
	var parent = this._parent;
	
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

	// (callback: TCallback, context: IContext) => void
	this.renderAttributes = function(callback, context) {
		dataRender(this._attributes, function(attributes) {
			var result = '';
			for (var key in attributes) {
				if (_.isNull(attributes[key])) result += ' '+key;
				else result += ' '+key+'="'+attributes[key]+'"';
			}
			callback(result);
		}, context);
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

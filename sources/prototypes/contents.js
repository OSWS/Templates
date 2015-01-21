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

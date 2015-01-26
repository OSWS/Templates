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
			dataRender(context, function(context) {
				_stringTemplate(result, context, callback);
			});
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

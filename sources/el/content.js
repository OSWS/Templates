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
	
	// (...arguments: Array<IContext>) => this;
	this.context = function() {
		for (var a in arguments) {
			_.extend(this._context, arguments[a]);
		};
		return this;
	};

	// (...arguments: Array<TCallback{1}, IContext>) => TAsync(callback: (result: any) => void) => void;
	this.render = function() {
		var callback = false;
		var context = {};
		for (var a in arguments) {
			if (_.isFunction(arguments[a])) callback = arguments[a];
			else if (_.isObject(arguments[a])) _.extend(context, arguments[a]); 
		}
		if (callback) this._render(callback, context);
		
		var instance = this;
		return asAsync(function(callback) {
			instance._render(callback, context);
		});
	};

	// (callback: TCallback, context: IContext) => this;
	this._render = function(callback, _context) {
		var context = _.extend({}, this._context);
		_.extend(context, _context);
		dataRender(this._content, function(result) {
			dataRender(context, function(renderedContext) {
				_stringTemplate(result.join(''), renderedContext, callback);
			}, context);
		}, context);
	};

	this.constructor = function() {
		parent.constructor.apply(this);
		this._content = [];
		if (_.isArray(this._parent._content)) this._content.push.apply(this._content, this._parent._content);
		this._context = {};
	};
});

// [new] (...arguments: Array<IAttributes|TSelector>) => .content => this;
var Double = exports.Double = Tag().extend(function(parent) {
	
	// string;
	this._quotesOpenLeft = '<';
	
	// string;
	this._quotesOpenRight = '>';
	
	// string;
	this._quotesCloseLeft = '</';
	
	// string;
	this._quotesCloseRight = '>';

	// () => any;
	this.return = function() {
		var instance = this;
		return wrapMethod(instance, function() {
			if (arguments.length > 0) return instance.content.apply(instance, arguments);
			else return instance;
		});
	};

	// (callback: TCallback, context: IContext) => this;
	this._render = function(callback, context) {
		var instance = this;
		parent._render.call(instance, function(result) {
			instance.renderAttributes(function(attributes) {
				callback(
instance._quotesOpenLeft + instance._name + attributes + instance._quotesOpenRight + result + instance._quotesCloseLeft + instance._name + instance._quotesCloseRight
				);
			}, context);
		}, context);
	};
});

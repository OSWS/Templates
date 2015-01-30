// [new] (...arguments: Array<IAttributes|TSelector>) => this;
var Single = exports.Single = Tag().extend(function() {
	var parent = this._parent;
	
	// string;
	this._quotesLeft = '<';

	// string;
	this._quotesRight = '/>';

	// (callback: TCallback, context: IContext) => this;
	this._render = function(callback, context) {
		var instance = this;
		parent._render(function(result) {
			instance.renderAttributes(function(attributes) {
				callback(
instance._quotesLeft + instance._name + attributes + instance._quotesRight
				);
			}, context);
		}, context);
	};
});

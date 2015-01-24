// [new] (...arguments: Array<IAttributes|TSelector>) => this;
var Single = exports.Single = Tag().extend(function(parent) {

	// string;
	this._quotesLeft = '<';

	// string;
	this._quotesRight = '/>';

	// (callback: TCallback) => this;
	this._render = function(callback) {
		var instance = this;
		parent._render(function(result) {
			instance.renderAttributes(function(attributes) {
				callback(
instance._quotesLeft + instance._name + attributes + instance._quotesRight
				);
			});
		})
	};
});

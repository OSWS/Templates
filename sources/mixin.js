var Mixin = exports.Mixin = Content().extend();

// (reconstructor: Function) => Content;
var mixin = exports.mixin = function(reconstructor) {
	if (!_.isFunction(reconstructor)) throw new Error('reconstructor must be a function');
	
	return Mixin().extend(function() {
		var parent = this._parent;
		this.constructor = function() {
			parent.constructor.apply(this);
			
			this.content(asSync(reconstructor.apply(this, arguments)));
		};
	});
};
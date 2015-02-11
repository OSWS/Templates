(function() {

T.Mixin = T.Data().extend();

// (reconstructor: Function) => Content;
T.mixin = function(reconstructor) {
	if (!_.isFunction(reconstructor)) throw new Error('reconstructor must be a function');
	
	return T.Mixin().extend(function() {
		var parent = this._parent;
		
		this.constructor = function() {
			parent.constructor.apply(this);
			
			this.data(reconstructor.apply(this, arguments));
		};
	});
};

})();
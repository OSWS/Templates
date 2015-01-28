var content = exports.content = Content().extend(function() {
	var parent = this._parent;
	this.constructor = function() {
		parent.constructor.apply(this);
		if (arguments.length > 0) this.content.apply(this, arguments);
	};
});

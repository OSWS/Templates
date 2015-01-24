var content = exports.content = Content().extend(function(parent) {
	this.constructor = function() {
		parent.constructor.apply(this);
		if (arguments.length > 0) this.content.apply(this, arguments);
	};
});

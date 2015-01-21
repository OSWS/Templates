var content = exports.content = Contents().extend(function(parent) {
	this.constructor = function() {
		parent.constructor.apply(this);
		this.content.apply(this, arguments);
	};
});

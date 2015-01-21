// [new] ([selector: string]*, [attributes: attributes]*) => .content([data]*) => instance: Double > Tag > Contents > Prototype
var Double = exports.Double = Tag().extend(function(parent) {
	this._quotesOpenLeft = '<';
	this._quotesOpenRight = '>';
	this._quotesCloseLeft = '</';
	this._quotesCloseRight = '>';

	this.generator = function() {
		var instance = this;

		this._data.push(this._quotesOpenLeft);
		this._data.push(function(callback) { dataRender(instance._name, function(result) {
			callback(result);
		}); });
		this._data.push(function(callback) { renderArrayData(instance._attributes, function(attributes) {
			var result = '';
			for (var key in attributes) {
				if (_.isNull(attributes[key])) result += ' '+key;
				else result += ' '+key+'="'+attributes[key]+'"';
			}
			callback(result);
		}); });
		this._data.push(this._quotesOpenRight);

		parent.generator.apply(this);

		this._data.push(this._quotesCloseLeft);
		this._data.push(function(callback) { dataRender(instance._name, function(result) {
			callback(result);
		}); });
		this._data.push(this._quotesCloseRight);
	};
	this.returner = function(instance) {
		return function() {
			if (arguments.length > 0) return instance.content.apply(instance, arguments);
			else return instance;
		};
	};
});

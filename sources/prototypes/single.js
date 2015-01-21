// [new] ([selector: string]*, [attributes: attributes]*) => instance: Single > Tag > Contents > Prototype
var Single = exports.Single = Tag().extend(function(parent) {
	this._quotesLeft = '<';
	this._quotesRight = '/>';

	this.generator = function() {
		var instance = this;

		this._data.push(this._quotesLeft);
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
		this._data.push(this._quotesRight);
	};
});

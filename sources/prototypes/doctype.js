// [new] ([selector: string]*, [attributes: attributes]*) => instance: Doctype > Single > Tag > Contents > Prototype
var Doctype = exports.Doctype = Single().extend(function(parent) {
	this._name = 'DOCTYPE';
	this._quotesLeft = '<!';
	this._quotesRight = '>';
});

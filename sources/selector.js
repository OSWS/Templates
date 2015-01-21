// (data: string, reg: RegExp) => string[][]
var regExpSearch = exports.regExpSearch = function(data, reg) {
	var result = [], temp = null;
	while ((temp = reg.exec(data)) != null) {
		if (temp.index === reg.lastIndex) reg.lastIndex++;
		result.push(temp);
	}
	return result;
}

// https://www.regex101.com/r/cM5jC6/9
var selectorRegExp = exports.selectorRegExp = (/(\[)|(\])|#([-\w\d]+)|\.([-\w\d]+)|([\w\d-]+)="(['\w\d\s-:\\\/\.\,\]\[={}<>%@#$%^&*~`]*)"|([\w\d-]+)='(["\w\d\s-:\\\/\.\,\]\[={}<>%@#$%^&*~`]*)'|([\w\d-]+)=([\w\d-:\\\/\.={}<>%@#$%^&*~`]*)|("['\w\d\s-:\\\/\.\,\]\[={}<>%@#$%^&*~`]+")|('["\w\d\s-:\\\/\.\,\]\[={}<>%@#$%^&*~`]+')|([_\w-:\\\/]+)/g);

// (data) => { [name: string]: string }
var parseSelector = exports.parseSelector = function(data) {
	var matchs = regExpSearch(data, selectorRegExp);
	var attributes = {};
	var isAttr = false;
	_.each(matchs, function(node) {
		if (node[1]) { isAttr = true; return; } // [
		else if (node[2]) { isAttr = false; return; } // ]

		if (isAttr) {
			if (node[9]) { attributes[node[9]] = node[10]; return; } // attr=value
			if (node[7]) { attributes[node[7]] = node[8]; return; } // attr='value'
			if (node[5]) { attributes[node[5]] = node[6]; return; } // attr="value"
			if (node[13]) { attributes[node[13]] = null; return; } // [attr]
			if (node[12]) { attributes[node[12]] = null; return; } // ['attr']
			if (node[11]) { attributes[node[11]] = null; return; } // ["attr"]
		} else {
			if (node[3]) { attributes.id = node[3]; return; } // id
			if (node[4]) { attributes.class? attributes.class += ' ' + node[4] : attributes.class = node[4]; return; } // class
		}
	});
	return attributes;
};

var _singles = exports._singles = ['br', 'hr', 'img', 'input', 'base', 'frame', 'link', 'meta', 'style'];

var singles = exports.singles = {};

for (var key in _singles) {
	singles[_singles[key]] = Single().name(_singles[key]).extend();
}
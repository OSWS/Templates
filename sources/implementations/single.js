var _single = exports._single = ['br', 'hr', 'img', 'input', 'base', 'frame', 'link', 'meta', 'style'];

var single = exports.single = {};

for (var key in _single) {
	single[_single[key]] = Single().name(_single[key]).extend();
}

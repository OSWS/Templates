(function() {

T._singles = ['br', 'hr', 'img', 'input', 'base', 'frame', 'link', 'meta', 'style'];

T.singles = {};

for (var key in T._singles) {
    T.singles[T._singles[key]] = T.Single().name(T._singles[key]).extend();
}

})();
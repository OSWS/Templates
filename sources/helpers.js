// (...keys: string[]) => void
T.static = function() {
    var _this = this;
    var _arguments = arguments;
    for (var a in _arguments) {
        (function(a) {
            _this[_arguments[a]] = function() {
                var i = _this.construct();
                return i[_arguments[a]].apply(i, arguments);
            };
        })(a);
    }
};
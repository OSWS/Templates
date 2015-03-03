describe('static', function() {
    describe('levels', function() {
        it('one', function() {
            var Constructor = (new T.Class()).extend(function() {
                var prototype = this.___prototype;
                this.a = function() { return 123 };
                this.extend = function() {
                    var extension = prototype.extend.apply(this, arguments);
                    T.static(extension, 'a');
                    return extension;
                };
            })().extend();
            assert.equal(Constructor.a(), 123);
        });
        it('two', function() {
            var Constructor = (new T.Class()).extend(function() {
                this.a = function() { return 123 };
            })().extend(function() {
                var prototype = this.___prototype;
                this.extend = function() {
                    var extension = prototype.extend.apply(this, arguments);
                    T.static(extension, 'a');
                    return extension;
                };
            })().extend();
            assert.equal(Constructor.a(), 123);
        });
    });
});
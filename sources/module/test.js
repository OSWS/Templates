describe('module', function() {
	it('string', function() {
		assert.equal(T.Module('<%= a %>')().context({ a: 1 }), '1');
	});
	it('errors', function() {
		assert.throws(function() {
			T.Module('<%= a %>')().render(function(result) {});
		});
	});
	it('mixin', function() {
		T.Module(T.mixin(function(a) { return T.data(a, '<%= b %>', 3); })(1)).render(function(error, result) {
			if (error) throw error;
			assert.equal(result, '123');
		}, { b: 2 });
	});
	it('data', function() {
		T.Module(T.data(1, '<%= a %>', 3)).render(function(error, result) {
			if (error) throw error;
			assert.equal(result, '123');
		}, { a: 2 });
	});
	it('tag', function() {
		T.Module(T.with.div()(1, '<%= a %>', 3)).render(function(error, result) {
			if (error) throw error;
			assert.equal(result, '<div>123</div>');
		}, { a: 2 });
	});
});
var Templates = require('../index.js');
var _ = require('lodash');
var assert = require('chai').assert;
var fs = require('fs');
var asSync = Templates.asSync;
var asAsync = Templates.asAsync;
var Prototype = Templates.Prototype;
var Content = Templates.Content;
var content = Templates.content;
var Tag = Templates.Tag;
var Single = Templates.Single;
var Double = Templates.Double;
var Doctype = Templates.Doctype;
var div = Templates.doubles.div;
var Mixin = Templates.Mixin;
var mixin = Templates.mixin;
var Module = Templates.Module;

describe('OSWS-Templates', function() {
	it('isSync', function() {
		assert.equal(Templates.isSync(asSync(function() {})), true);
		assert.equal(Templates.isSync(asAsync(function(callback) {})), false);
		assert.equal(Templates.isSync(function(callback, other) {}), false);
		assert.equal(Templates.isSync(function(any, args) {}), false);
	});
	it('isAsync', function() {
		assert.equal(Templates.isAsync(asSync(function() {})), false);
		assert.equal(Templates.isAsync(asAsync(function(callback) {})), true);
		assert.equal(Templates.isAsync(function(callback, other) {}), false);
		assert.equal(Templates.isAsync(function(any, args) {}), false);
	});
	describe('dataRender', function() {
		it('string', function(done) {
			Templates.dataRender('string', function(result) { assert.equal(result, 'string'); done(); });
		});
		it('TSync', function(done) {
			Templates.dataRender(asSync(function() { return 'string'; }), function(result) { assert.equal(result, 'string'); done(); });
		});
		it('TAsync', function(done) {
			Templates.dataRender(asAsync(function(callback) { callback('string'); }), function(result) { assert.equal(result, 'string'); done(); });
		});
		it('Function', function(done) {
			var bug = function(a, b, c) { return 'bug' };
			Templates.dataRender(bug, function(result) { assert.equal(result, bug); done(); });
		});
		it('Function with Element', function(done) {
			Templates.dataRender(asSync(function() { return div; }), function(result) { assert.equal(result, '<div></div>'); done(); });
		});
		it('Content', function(done) {
			var Temp = content().content(1).extend();
			Templates.dataRender(Temp, function(result) { assert.equal(result, 1); done(); });
		});
		it('Object', function(done) {
			Templates.dataRender({ key: 'value' }, function(result) { assert.equal(result.key, 'value'); done(); });
		});
		it('Array', function(done) {
			Templates.dataRender(['key', asSync(function() { return 'value'; })], function(result) { assert.equal(result[1], 'value'); done(); });
		});
		it('context', function(done) {
			Templates.dataRender(div()(
				'<%= n1 %>',
				div()('<%= n2 %><%= n3 %>').context({ n2: 2, n3: 3 })
			), function(result) {
				assert.equal(result, '<div>1<div>43</div></div>');
				done();
			}, { n1: 1, n2: 4 });
		});
	});
	describe('parseSelector', function() {
		it('basic', function() {
			var _attributes = {};
			Templates.parseSelector(_attributes, ".class-.fdsaDss.pngClas-gfdreDS#Id1#Id2[attr1=http://google.com/images/logo.png,attr2='http://.com/images/logo.png'][attr3='.com/images/logo.png',attr4'attr5' 'attr6'][alt=#item]");
			assert.deepEqual(_attributes, {
				class: 'class- fdsaDss pngClas-gfdreDS',
				id: 'Id2',
				alt: '#item',
				attr1: 'http://google.com/images/logo.png',
				attr2: 'http://.com/images/logo.png',
				attr3: '.com/images/logo.png',
				attr4: null,
				"'attr5'": null,
				"'attr6'": null,
			});
		});
		it('overriding', function() {
			var _attributes = {};
			Templates.parseSelector(_attributes, ".class-.fdsaDss.pngClas-gfdreDS#Id1#Id2[attr1=http://google.com/images/logo.png,attr2='http://.com/images/logo.png'][attr3='.com/images/logo.png',attr4'attr5' 'attr6'][alt=#item]");
			Templates.parseSelector(_attributes, ".addedClass[alt=overrided]");
			assert.deepEqual(_attributes, {
				class: 'class- fdsaDss pngClas-gfdreDS addedClass',
				id: 'Id2',
				alt: 'overrided',
				attr1: 'http://google.com/images/logo.png',
				attr2: 'http://.com/images/logo.png',
				attr3: '.com/images/logo.png',
				attr4: null,
				"'attr5'": null,
				"'attr6'": null,
			});
		});
	});
	describe('Prototype', function() {
		it('new', function() {
			var parent = new Prototype();
			var El = parent.extend();
			var el = El(1,2,3);
			assert.ok(el instanceof El);
			assert.ok(el instanceof Prototype);
			assert.ok(el._parent === parent);
			assert.ok(el._arguments[1] === 2);
		});
		describe('Content', function() {
			it('render', function(done) {
				var el = Content().content(
					'1',
					asSync(function() { return '<%= n2 %>'; }),
					asAsync(function(callback) { setTimeout(function() { callback('<%= n3 %>'); }, 150); }),
					Content().content('<%= n4 %>')
				);
				el.render(function(result) {
					assert.equal(result, '1234');
					done()
				}, { n2: 2, n3: 3, n4: 4 });
			});
			it('multi-layered', function(done) {
				var el = Content().content(
					'1',
					asSync(function() { return '<%= n2 %>'; }),
					asAsync(function(callback) { setTimeout(function() { callback('<%= n3.val %>'); }, 150); }),
					Content().content('<%= n4 %>')
				);
				el.render(function(result) {
					assert.equal(result, '1234');
					done();
				}, { n2: 2, n3: { val: 3 }, n4: 4 });
			});
			it('append prepend', function(done) {
				var el = Content()
				el.append(1).content(2).prepend(3).append(4);
				el.render(function(result) {
					assert.equal(result, '324');
					done();
				});
			});
			it('Tag', function(done) {
				var div = Templates.doubles.div;
				var el = Content()
				el.content(
					div,
					div('.container'),
					div('.container')('content')
				)
				el.render(function(result) {
					assert.equal(result, '<div></div><div class="container"></div><div class="container">content</div>');
					done();
				});
			});
			it('async result', function(done) {
				content(
					content('<%= n1 %>').context({ n1: 1 }),
					content('<%= n1 %>').render({ n1: 2 })
				).render({ n1: 3 }, function(result) {
					assert.equal(result, '32');
					done();
				})
			});
			describe('Mixin', function() {
				it('mixin', function(done) {
					var mix = mixin(function(a, b, c) { return div({ a: a })(b, div()(c)) });
					assert.ok(mix() instanceof Mixin && mix() instanceof Content);
					mix(1,2,3).render(function(result) {
						assert.equal(result, '<div a="1">2<div>3</div></div>');
						done();
					});
				});
			});
			describe('content', function() {
				it('cosntructor', function(done) {
					content(1,2,3).render(function(result) {
						assert.equal(result, '123');
						done();
					})
				});
			});
			describe('Tag', function() {
				it('name and attributes', function() {
					var tag = Tag('.class.name#id').name('div');
					assert.equal(tag._name, 'div');
					assert.deepEqual(tag._attributes, { class: "class name", id: "id" });
				});
				it('renderAttributes', function() {
					var tag = Tag('.class.name#id').name('div');
					tag.renderAttributes(function(result) { assert.equal(result, ' class="class name" id="id"'); });
				});
				describe('Single', function() {
					it('img', function(done) {
						var img = Single('.round').name('img').extend();
						img().render(function(result) {
							assert.equal(result, '<img class="round"/>');
							done();
						});
					});
					describe('singles', function() {
						it('img', function(done) {
							Templates.singles.img('.round').render(function(result) {
								assert.equal(result, '<img class="round"/>');
								done();
							});
						});
					});
				});
				describe('Double', function() {
					it('div', function(done) {
						var div = Double('.container')('content').name('div').extend();
						div()().render(function(result) {
							assert.equal(result, '<div class="container">content</div>');
							done();
						});
					});
					describe('doubles', function() {
						it('div', function(done) {
							Templates.doubles.div('.container')('content').render(function(result) {
								assert.equal(result, '<div class="container">content</div>');
								done();
							});
						});
					});
				});
				describe('Doctype', function() {
					it('html', function(done) {
						var html = Doctype('[html]').extend();
						html().render(function(result) {
							assert.equal(result, '<!DOCTYPE html>');
							done();
						});
					});
					describe('doctypes', function() {
						it('html', function(done) {
							Templates.doctypes.html().render(function(result) {
								assert.equal(result, '<!DOCTYPE html>');
								done();
							});
						});
					});
				});
			});
			describe('Module', function() {
				it('string', function(done) {
					Module('<%= a %>')().render(function(result) {
						assert.equal(result, '1');
						done();
					}, { a: 1 });
				});
				it('errors', function() {
					assert.throws(function() {
						Module('<%= a %>')().render(function(result) {});
					});
				});
				it('mixin', function(done) {
					Module(mixin(function(b) { return b + '<%= a %>'; }))(2).render(function(result) {
						assert.equal(result, '21');
						done();
					}, { a: 1 });
				});
				it('inherit', function() {
					assert.ok(Module(mixin(function(b) { return b + '<%= a %>'; }))(2) instanceof Module);
				});
			});
		});
	});
	it('with', function(done) {
		with (Templates.with) {
			h1()('content').render(function(result) {
				assert.equal(result, '<h1>content</h1>');
				done();
			})
		}
	});
	describe('includes', function() {
		it('_stringRequire', function() {
			assert.equal(Templates._jsContentRequire('module.exports = __dirname;', __dirname + '/module.js'),  __dirname);
		});
		it('includeString', function(done) {
			Templates.includeString(fs.readFileSync(__dirname + '/module.js', 'utf-8'), __dirname + '/module.js')().render(function(result) {
				assert.equal(result, '<div>content</div>');
				done();
			});
		});
		it('includeSync', function(done) {
			Templates.includeSync(__dirname + '/module.js')().render(function(result) {
				assert.equal(result, '<div>content</div>');
				done();
			});
		});
		it('include', function(done) {
			Templates.include(__dirname + '/module.js', function(result) {
				result().render(function(result) {
					assert.equal(result, '<div>content</div>');
					done();
				});
			});
		});
		it('include asAsync', function(done) {
			var async = Templates.include(__dirname + '/module.js');
			async(function(result) {
				result().render(function(result) {
					assert.equal(result, '<div>content</div>');
					done();
				});
			});
		});
	});
});
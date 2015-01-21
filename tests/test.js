var Templates = require('../index.js');
var _ = require('lodash');
var assert = require('assert');

var Prototype = Templates.Prototype;
var Contents = Templates.Contents;
var Tag = Templates.Tag;
var Single = Templates.Single;
var Double = Templates.Double;
var Doctype = Templates.Doctype;

var doctype = Templates.doctype;
var single = Templates.single;
var double = Templates.double;
var content = Templates.content;

describe('OSWS-Templates', function() {
	describe('prototypes', function() {
		describe('Prototype', function() {
			it('new fixed', function() {
				var El = (new Prototype()).extend();
				var el = El();
				assert.ok(_.isObject(el) && el instanceof El);
			});
			it('render', function(done) {
				var El = (new Prototype()).extend();
				var el = El();
				el._data = [
					'1',
					function() { return '2'; },
					function(callback) { callback('3'); },
					(function() {
						var e = El();
						e._data = ['4'];
						return e;
					})()
				];
				el.render(function(result) {
					assert.equal(result, '1234');
					done();
				});
			});
			it('render', function(done) {
				var El = (new Prototype()).extend();
				var el = El();
				el._data = [
					'1',
					function() { return '2'; },
					function(callback) { callback('3'); },
					(function() {
						var e = El();
						e._data = ['4'];
						return e;
					})()
				];
				el.render(function(result) {
					assert.equal(result, '1234');
					done();
				});
			});
			it('context', function(done) {
				var El = (new Prototype()).extend();
				var el = El();
				el._data = [
					'1<%= n2 %>',
					function() { return '<%= n3 %>4'; },
					function(callback) { callback('5'); },
					(function() {
						var e = El();
						e._data = ['6<%= n7 %>'];
						return e;
					})()
				];
				el._context = {
					n2: 2, n3: 3, n7: 7
				};
				el.render(function(result) {
					assert.equal(result, '1234567');
					done();
				});
			});
		});
		describe('Contents', function() {
			it('prepend content append', function(done) {
				var c0 = Contents();
				c0.append('0');
				c0.content('2');
				c0.prepend('1');
				var c1 = Contents();
				c1.append(function(callback) { callback('4'); });
				c0.append('3', c1);
				c0.render(function(result) {
					assert.equal(result, '1234');
					done();
				});
			});
		});
		describe('Single', function() {
			it('quotes, name, selector and attributes', function(done) {
				var img = Single('.round[src=img.png]').name('img').extend();
				img('.circle.big[src="img.jpg"]', { alt: 'text' }).render(function(result) {
					assert.equal(result, '<img class="circle big" src="img.jpg" alt="text"/>');
					done();
				});
			});
		});
		describe('Double', function() {
			it('quotes, name, selector and attributes', function(done) {
				var div = Double()().name('div').extend();
				div()('content').render(function(result) {
					assert.equal(result, '<div>content</div>');
					done();
				});
			});
		});
		describe('Doctype', function() {
			it('correct attributes', function(done) {
				var doctypeHtml = Doctype().extend();
				doctypeHtml('[html]').render(function(result) {
					assert.equal(result, '<!DOCTYPE html>');
					done();
				});
			});
		});
	});
	describe('implementations', function() {
		it('doctype', function() {
			doctype.html().render(function(result) { assert.equal(result, '<!DOCTYPE html>'); });
			doctype.transitional().render(function(result) { assert.equal(result, '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'); });
			doctype.strict().render(function(result) { assert.equal(result, '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'); });
			doctype.frameset().render(function(result) { assert.equal(result, '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">'); });
			doctype.basic().render(function(result) { assert.equal(result, '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">'); });
			doctype.mobile().render(function(result) { assert.equal(result, '<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">'); });
		});
		it('tags', function() {
			var html = double.html, body = double.body, head = double.head, div = double.div, h1 = double.h1, img = single.img, meta = single.meta;

			content(
				doctype.html(),
				html()(
					head()(
						meta('[charset=utf-8]')
					),
					body()(
						div('.document')(
							h1()('Example'),
							img('[src=example.png]')
						)
					)
				)
			).render(function(result) {
				assert.equal(result, '<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body><div class="document"><h1>Example</h1><img src="example.png"/></div></body></html>');
			})
		});
		it('context', function() {
			var div = double.div, h1 = double.h1;

			div('.class[alt="<%= name %>"]')(
				h1()('<%= title %>')
			).render(function(result) {
				assert.equal(result, '<div class="class" alt="semple"><h1>Example</h1></div>');
			}, { title: 'Example', name: 'semple' });
		});
		it('content and attributes inheritance', function() {
			var div = double.div;
			
			var el = div('[data-src=#item]')(
				'data',
				div()('div')
			).extend();
			
			el()().render(function(result) {
				assert.equal(result, '<div data-src="#item">data<div>div</div></div>');
			})
		});
	});
});
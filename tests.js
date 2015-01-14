var _ = require('lodash');
var assert = require('assert');
var Renderer = require('osws-renderer-ts');

var Templates = require('./index.js');

var testSelector = 'tag-Na,me123.teSt-Class.cont,ainer#FirstId#secont-id[data-num=123,str="check"]';

describe('OSWS-Templates', function() {
	describe('RegExpSearchSelector', function() {
		var RegExpSearchSelector = Templates.RegExpSearchSelector;

		describe('string', function() {
			it('name', function() {
				assert.equal(RegExpSearchSelector.name(testSelector), 'tag-Na');
			});
			it('id', function() {
				assert.equal(RegExpSearchSelector.id(testSelector), 'FirstId');
			});
			it('classes', function() {
				assert.deepEqual(RegExpSearchSelector.classes(testSelector), ['teSt-Class', 'cont']);
			});
			it('attributes', function() {
				assert.deepEqual(RegExpSearchSelector.attributes(testSelector), {'data-num':'123', 'str':'check'});
			});
		});
	});
	describe('QueueContent', function() {
		var QueueContent = Templates.QueueContent;

		it('all types', function(done) {
			var queue = new Renderer.Queue();

			QueueContent(queue, [
				'string',
				function() { return 'sync'; },
				function(callback) { callback('async'); },
				(function(){
					var queue = new Renderer.Queue();
					queue.addString('queue');
					return queue;
				})(),
				Templates.content('content')
			]);

			queue.renderAsync(function(error, result){
				if (error) throw error;
				assert.equal(result, 'string' + 'sync' + 'async' + 'queue' + 'content');
				done();
			});
		});
	});
	describe('content', function() {
		var content = Templates.content;

		it('all types', function(done) {
			var c = content(
				'string',
				function() { return 'sync'; },
				function(callback) { callback('async'); },
				(function(){
					var queue = new Renderer.Queue();
					queue.addString('queue');
					return queue;
				})(),
				Templates.content('content')
			);

			c.render(function(error, result){
				if (error) throw error;
				assert.equal(result, 'string' + 'sync' + 'async' + 'queue' + 'content');
				done();
			});
		});
	});
	describe('Tag', function() {
		var Tag = Templates.Tag;

		describe('selectors', function() {
			it('name', function() {
				var tag0 = Tag('tag0'); // selector
				assert.equal(tag0.name, 'tag0');
				var Tag1 = tag0.extend();
				var tag1 = Tag1('tag1'); // inherit
				assert.equal(tag1.name, 'tag0');
				var Tag2 = tag1.extend(function(parent) {
					this.constructor = function() {
						parent.constructor.apply(this, arguments);
						this.name = 'Tag2';
					};
				});
				var tag2 = Tag2(); // inherit
				assert.equal(tag2.name, 'Tag2');
			});

			it('id', function() {
				var tag0 = Tag('#tag0'); // selector
				assert.equal(tag0.attributes.id, 'tag0');
				var Tag1 = tag0.extend();
				var tag1 = Tag1('#tag1'); // inherit
				assert.equal(tag0.attributes.id, 'tag0');
				var Tag2 = tag1.extend(function(parent) {
					this.constructor = function() {
						parent.constructor.apply(this, arguments);
						this.attributes.id = 'Tag2';
					};
				});
				var tag2 = Tag2(); // inherit
				assert.equal(tag0.attributes.id, 'tag0');
			});

			it('class', function() {
				var tag0 = Tag('.Tag.tag0') // selector
				assert.deepEqual(tag0.attributes.class, ['Tag', 'tag0']);
				var Tag1 = tag0.extend();
				var tag1 = Tag1('.Tag1.tag1'); // inherit
				assert.deepEqual(tag1.attributes.class, ['Tag', 'tag0', 'Tag1', 'tag1']);
				assert.deepEqual(tag0.attributes.class, ['Tag', 'tag0']);
				var Tag2 = tag1.extend(function(parent) {
					this.constructor = function() {
						parent.constructor.apply(this, arguments);
						this.attributes.class.push('other');
					};
				});
				var tag2 = Tag2(); // inherit
				assert.deepEqual(tag2.attributes.class, ['Tag', 'tag0', 'Tag1', 'tag1', 'other']);
			});

			it('attributes', function() {
				var tag0 = Tag('[data-attributes=0]') // selector
				assert.equal(tag0.attributes['data-attributes'], '0');
				var Tag1 = tag0.extend();
				var tag1 = Tag1('[data-attributes=1]'); // inherit
				assert.equal(tag1.attributes['data-attributes'], '1');
				assert.equal(tag0.attributes['data-attributes'], '0');
				var Tag2 = tag1.extend(function(parent) {
					this.constructor = function() {
						parent.constructor.apply(this, arguments);
						this.attributes['data-attributes'] = '2';
					};
				});
				var tag2 = Tag2(); // inherit
				assert.equal(tag2.attributes['data-attributes'], '2');
			});
		});

		it('attributes', function() {
			var tag0 = Tag({'data-attributes': 0}) // selector
			assert.equal(tag0.attributes['data-attributes'], '0');
			var Tag1 = tag0.extend();
			var tag1 = Tag1({'data-attributes': 1}); // inherit
			assert.equal(tag1.attributes['data-attributes'], '1');
			assert.equal(tag0.attributes['data-attributes'], '0');
			var Tag2 = tag1.extend(function(parent) {
				this.constructor = function() {
					parent.constructor.apply(this, arguments);
					this.attributes['data-attributes'] = '2';
				};
			});
			var tag2 = Tag2(); // inherit
			assert.equal(tag2.attributes['data-attributes'], '2');
		});
	});
	it('Single', function() {
		var Single = Templates.Single;

		var _img = Single('img');
		var img = _img.extend();

		var i = img('[src=http://google.com/images/logo.png]')
		i.render(function(error, result) {
			assert.equal(result, '<img src="http://google.com/images/logo.png"/>')
		});
	});
	describe('Double', function() {
		it('empty', function() {
			var Double = Templates.Double;

			var _a = Double('a')();
			var a = _a.extend();

			var __a = a('[href=http://google.com/]')()
			__a.render(function(error, result) {
				assert.equal(result, '<a href="http://google.com/"></a>')
			});
		});
		it('content', function() {
			var Double = Templates.Double;

			var _div = Double('div')('inherit');
			var div = _div.extend();

			var __div = div()('content')
			__div.render(function(error, result) {
				assert.equal(result, '<div>inheritcontent</div>')
			});
		});
	});
	describe('tags', function() {
		it('img', function() {
			var img = Templates.img;
			var i = img('[src=http://google.com/images/logo.png]');
			i.render(function(error, result) {
				assert.equal(result, '<img src="http://google.com/images/logo.png"/>');
			});
		});
		it('a', function() {
			var a = Templates.a;
			var _a = a('[href=http://google.com/]')();
			_a.render(function(error, result) {
				assert.equal(result, '<a href="http://google.com/"></a>');
			});
		});
		it('div', function() {
			var div = Templates.div;
			var _div = div()('content');
			_div.render(function(error, result) {
				assert.equal(result, '<div>content</div>')
			});
		});
	});
});
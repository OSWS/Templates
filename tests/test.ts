/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../templates.d.ts" />
/// <reference path="../queues.d.ts" />

import assert = require('assert');

import Templates = require('osws-templates');
import Queues = require('osws-queues');

describe('OSWS-Templates', () => {
	it('QueueContent', (done) => {
		var queue = new Queues.Queue();
		Templates.QueueContent(queue, [
			'1', () => { return '2'; }, (callback) => { callback('3'); },
			(() => {
				var queue = new Queues.Queue();
				queue.add('4');
				return queue;
			})(),
			Templates.content('5')
		]);
		queue.render((error, result) => {
			assert.equal(result, '12345');
			done();
		});
	});
	it('content', (done) => {
		Templates.content(
			'1', () => { return '2'; }, (callback) => { callback('3'); },
			(() => {
				var queue = new Queues.Queue();
				queue.add('4');
				return queue;
			})(),
			Templates.content('5')
		).render((error, result) => {
			assert.equal(result, '12345');
			done();
		});
	});
	it('tags', (done) => {
		Templates.tags.div()(
			'1', () => { return '2'; }, (callback) => { callback('3'); },
			(() => {
				var queue = new Queues.Queue();
				queue.add('4');
				return queue;
			})(),
			Templates.content('5'),
			Templates.tags.span()('6'),
			Templates.tags.br()
		).render((error, result) => {
			assert.equal(result, '<div>12345<span>6</span><br/></div>');
			done();
		});
	});
	it('doctypes', (done) => {
		Templates.content(
			Templates.doctypes.html(),
			Templates.doctypes.xml(),
			Templates.doctypes.transitional(),
			Templates.doctypes.strict(),
			Templates.doctypes.frameset(),
			Templates.doctypes.basic(),
			Templates.doctypes.mobile()
		).render((error, result) => {
			assert.equal(result, '<!DOCTYPE html><?xml version="1.0" encoding="utf-8"?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd"><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd"><!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">');
			done();
		});
	});
	it('each', (done) => {
		var div = Templates.tags.div;

		var tags = div('.class')()
		tags.render((error, result) => {
			assert.equal(result, '<div class="class"></div>');
		});

		tags.attr('#Id.container')
		tags.render((error, result) => {
			assert.equal(result, '<div class="class container" id="Id"></div>');
		});

		tags.content('content', div()())
		tags.render((error, result) => {
			assert.equal(result, '<div class="class container" id="Id">content<div></div></div>');
		});
		
		tags.before('before')
		tags.render((error, result) => {
			assert.equal(result, '<div class="class container" id="Id">beforecontent<div></div></div>');
		});

		tags.after('after')
		tags.render((error, result) => {
			assert.equal(result, '<div class="class container" id="Id">beforecontent<div></div>after</div>');
		});

		tags.attributes.id = 'else';
		tags.render((error, result) => {
			assert.equal(result, '<div class="class container" id="else">beforecontent<div></div>after</div>');
		});

		tags.each(function(content, indexes: number[]) { // (content: selector:string|Queues.ISyncCallback|Queues.IAsyncCallback, indexes: number[])
		    // indexes == [0,0] // content: string = "before"
		    // indexes == [1,0] // content: string = "content"
		    // indexes == [1,1] // content: Queues.IAsyncCallback // rendering div
		    // indexes == [0,1] // content: string = "after"
		});

		tags.name = 'span';
		tags.render((error, result) => {
			assert.equal(result, '<span class="class container" id="else">beforecontent<div></div>after</span>');
		});

		done();
	});
});
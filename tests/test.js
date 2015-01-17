/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../templates.d.ts" />
/// <reference path="../queues.d.ts" />
var assert = require('assert');
var Templates = require('osws-templates');
var Queues = require('osws-queues');
describe('OSWS-Templates', function () {
    it('QueueContent', function (done) {
        var queue = new Queues.Queue();
        Templates.QueueContent(queue, [
            '1',
            function () {
                return '2';
            },
            function (callback) {
                callback('3');
            },
            (function () {
                var queue = new Queues.Queue();
                queue.add('4');
                return queue;
            })(),
            Templates.content('5')
        ]);
        queue.render(function (error, result) {
            assert.equal(result, '12345');
            done();
        });
    });
    it('content', function (done) {
        Templates.content('1', function () {
            return '2';
        }, function (callback) {
            callback('3');
        }, (function () {
            var queue = new Queues.Queue();
            queue.add('4');
            return queue;
        })(), Templates.content('5')).render(function (error, result) {
            assert.equal(result, '12345');
            done();
        });
    });
    it('tags', function (done) {
        Templates.tags.div()('1', function () {
            return '2';
        }, function (callback) {
            callback('3');
        }, (function () {
            var queue = new Queues.Queue();
            queue.add('4');
            return queue;
        })(), Templates.content('5'), Templates.tags.span()('6'), Templates.tags.br()).render(function (error, result) {
            assert.equal(result, '<div>12345<span>6</span><br/></div>');
            done();
        });
    });
    it('doctypes', function (done) {
        Templates.content(Templates.doctypes.html(), Templates.doctypes.xml(), Templates.doctypes.transitional(), Templates.doctypes.strict(), Templates.doctypes.frameset(), Templates.doctypes.basic(), Templates.doctypes.mobile()).render(function (error, result) {
            assert.equal(result, '<!DOCTYPE html><?xml version="1.0" encoding="utf-8"?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd"><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd"><!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">');
            done();
        });
    });
});

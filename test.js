require('source-map-support').install();

global.T = require('./');
global._ = require('lodash');
global.assert = require('chai').assert;
global.is = require('is_js');

describe('osws-templates@0.3.0', function() {
    require(__dirname + '/sources/compiler/test.js');
    
    require(__dirname + '/sources/render/test.js');
    
    require(__dirname + '/sources/sync/test.js');
    require(__dirname + '/sources/async/test.js');
    
    require(__dirname + '/sources/prototype/test.js');
    require(__dirname + '/sources/renderer/test.js');
    require(__dirname + '/sources/data/test.js');
    require(__dirname + '/sources/tag/test.js');
    require(__dirname + '/sources/single/test.js');
    require(__dirname + '/sources/singles/test.js');
    require(__dirname + '/sources/double/test.js');
    require(__dirname + '/sources/doubles/test.js');
    require(__dirname + '/sources/doctype/test.js');
    require(__dirname + '/sources/doctypes/test.js');
    require(__dirname + '/sources/xml/test.js');
    
    require(__dirname + '/sources/mixin/test.js');
    require(__dirname + '/sources/mixins/test.js');
    
    require(__dirname + '/sources/module/test.js');
    
    require(__dirname + '/sources/with/test.js');
    
    it('example', function() {
        with (T.with) {
            assert.equal(
                String(data(
                    doctypes.html(),
                    html()(
                        head()(
                            title()('example'),
                            css('style.css'),
                            js('require.js', {'data-main': 'index.js'})
                        ),
                        body()(sync(function() {
                            var b = data();
                            for (var a in [1,2,3,4,5]) {
                                b.append(div({'data-index': a})())
                            }
                            return b;
                        }), async(function(callback) {
                            var b = data();
                            for (var a in [1,2,3,4,5]) {
                                b.append(div({'data-index': a})())
                            }
                            callback(null, b);
                        }))
                    )
                )),
                '<!DOCTYPE html><html><head><title>example</title><link rel="stylesheet" href="style.css"/><script type="text/javascript" src="require.js" data-main="index.js"></script></head><body><div data-index="0"></div><div data-index="1"></div><div data-index="2"></div><div data-index="3"></div><div data-index="4"></div><div data-index="0"></div><div data-index="1"></div><div data-index="2"></div><div data-index="3"></div><div data-index="4"></div></body></html>'
            );
        }
    });
});
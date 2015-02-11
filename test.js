// require('source-map-support').install();

global.T = require('./');
global._ = require('lodash');
global.assert = require('chai').assert;
global.is = require('is_js');

describe('osws-templates@0.3.0', function() {
    require('./sources/compiler/test.js');
    
    require('./sources/sync/test.js');
    require('./sources/async/test.js');
    
    require('./sources/prototype/test.js');
    require('./sources/data/test.js');
    require('./sources/tag/test.js');
    require('./sources/single/test.js');
    require('./sources/double/test.js');
    require('./sources/doctype/test.js');
    require('./sources/xml/test.js');
    
    require('./sources/mixin/test.js');
    
    require('./sources/render/test.js');
    
    it('context', function() {
        assert.equal(T.doubles.div()('<%= a %>').context({ a: 1 }), '<div>1</div>');
    });
});
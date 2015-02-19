// require('source-map-support').install();

global.T = require('./');
global._ = require('lodash');
global.assert = require('chai').assert;
global.is = require('is_js');
global.fs = require('fs');

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
    
    require(__dirname + '/sources/cli/test.js');
});
require('source-map-support').install();

global.T = require('../../');
global._ = require('lodash');
global.assert = require('chai').assert;

describe('oswst', function() {
    require('../../sources/compiler/test.js');
    
    require('../../sources/render/test.js');
    
    require('../../sources/sync/test.js');
    require('../../sources/async/test.js');
    
    require('../../sources/prototype/test.js');
    require('../../sources/renderer/test.js');
    require('../../sources/data/test.js');
    require('../../sources/tag/test.js');
    require('../../sources/single/test.js');
    require('../../sources/singles/test.js');
    require('../../sources/double/test.js');
    require('../../sources/doubles/test.js');
    require('../../sources/doctype/test.js');
    require('../../sources/doctypes/test.js');
    require('../../sources/xml/test.js');
    
    require('../../sources/mixin/test.js');
    require('../../sources/mixins/test.js');
    
    require('../../sources/module/test.js');
    
    require('../../sources/with/test.js');
    
    require('../../sources/cli/test.js');
});
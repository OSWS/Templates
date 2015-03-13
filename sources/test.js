global.T = require('./index.js');
global.assert = require('chai').assert;

describe('oswst@'+require('../package.json').version, function() {
    require('./class/test.js');
    require('./static/test.js');
    require('./compile/test.js');
    require('./sync/test.js');
    require('./async/test.js');
    require('./compiler/test.js');
    require('./context/test.js');
    require('./data/test.js');
});
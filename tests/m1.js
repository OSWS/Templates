var lodash = require('lodash');

var T = require('../index.js');

if (T.include('m2.js') != 'm2') throw new Error('Unexpected exports.');

with (T.with) {
    module.exports = mixin(function() { return div()('content'); });
}
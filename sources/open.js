(function(factory) {
    if(typeof define === 'function' && define.amd) {
        define(['module', 'lodash', 'async'], function(module, _, async) {
            module.exports = factory( _, async);
        });
    } else if(typeof exports === 'object') {
        module.exports = factory(require('lodash'), require('async'));
    }
    if (typeof(window) == 'object') window.oswst = factory;
    if (typeof(global) == 'object') global.oswst = factory;
})(function(_, async) {
    var T = {};
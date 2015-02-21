(function(factory) {
    if(typeof define === 'function' && define.amd) {
        define(['module', 'lodash', 'async'], function(module, _, async) {
            module.exports = factory( _, async);
        });
    } else if(typeof exports === 'object') {
        module.exports = factory(require('lodash'), require('async'));
    }
    var Factory = function() {
        return factory.apply(factory, arguments);
    };
    if (typeof(window) == 'object') window.oswst = Factory;
    if (typeof(global) == 'object') global.oswst = Factory;
})(function(_, async) {
    var T = {};
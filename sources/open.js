(function(factory) {
    if(typeof define === 'function' && define.amd) {
        define(['module', 'lodash'], function(module, _) {
            module.exports = factory({}, _);
        });
    } else if(typeof exports === 'object') {
        module.exports = factory({}, require('lodash'));
    }
})(function(T, _) {
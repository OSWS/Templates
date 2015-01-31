var _ = require('lodash');
var async = require('async');
var fs = require('fs');
var vm = require('vm');
var Module = require('module');
var path = require('path');

var _jsContentRequire = exports._jsContentRequire = function(content, filename) {
    var m = new Module(filename, module);
    Module._cache[filename] = m;
    m.filename = filename;
    m.paths = Module._nodeModulePaths(path.dirname(filename));
    m._compile(content, filename);
    m.loaded = true;
    return m.exports;
};

var includeString = exports.includeString = function(content, filename) {
    return exports.Module(_jsContentRequire(content, filename));
};

var include = exports.include = function(filename, callback) {
    var result = asAsync(function(callback) {
        fs.readFile(filename, 'utf-8', function(error, content) {
            if (error) throw new error;
            else {
                var result = includeString(content, filename);
                callback(result);
            }
        });
    });
    if (callback) result(callback);
    return result;
};

var includeSync = exports.includeSync = function(filename) {
    return includeString(fs.readFileSync(filename, 'utf-8'), filename);
};
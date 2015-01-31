var _ = require('lodash');
var async = require('async');
var fs = require('fs');
var vm = require('vm');

var _stringRequire = exports._stringRequire = function(file, path) {
    var m = new module.constructor();
    vm.runInThisContext(require('module').wrap(file))(m.exports, m.require, m, path, require('path').dirname(path));
    return m.exports;
};

var includeString = exports.includeString = function(file, path) {
    return exports.Module(_stringRequire(file, path));
};

var include = exports.include = function(path, callback) {
    var result = asAsync(function(callback) {
        fs.readFile(path, 'utf-8', function(error, file) {
            if (error) throw new error;
            else {
                var result = includeString(file, path);
                callback(result);
            }
        });
    });
    if (callback) result(callback);
    return result;
};

var includeSync = exports.includeSync = function(path) {
    return includeString(fs.readFileSync(path, 'utf-8'), path);
};
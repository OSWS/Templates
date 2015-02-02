var fs = require('fs');
var vm = require('vm');
var Module = require('module');
var path = require('path');

var callsite = require('callsite');

// (content: string, filename: string) => Module template.exports
exports.compile = function(content, filename) {
    var template = new Module(filename, module);
    template.filename = filename;
    template.paths = Module._nodeModulePaths(path.dirname(filename));
    template._compile(content, filename);
    template.loaded = true;
    return template.exports;
};

// (id: string) => Module template.exports
exports.include = function(id) {
    var dirname = path.dirname(callsite()[1].getFileName());
    var filename = path.normalize(path.join(dirname, id));
    if(require.cache[filename]) delete require.cache[filename];
    return require(filename);
};
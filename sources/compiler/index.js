// Available only on the server!

if(typeof exports === 'object') {

(function(Module, path, callsite) {

// String as a separate module.
// Do not cache the result.

// (filebody: string, filepath: string) => Module.exports;
T.compile = function(filebody, filepath) {
    var template = new Module(filepath, module);
    template.filename = filepath;
    template.paths = Module._nodeModulePaths(path.dirname(filepath));
    template._compile(filebody, filepath);
    template.loaded = true;
    return template.exports;
};

// As require, but do not cache the result.

// (id: string) => Module.exports;
T.include = function(id) {
    if (path.resolve(id) == path.normalize(id)) var filename = id;
    else {
        var dirname = path.dirname(callsite()[1].getFileName());
        var filename = path.normalize(path.join(dirname, id));
    }
    if(require.cache[filename]) delete require.cache[filename];
    return require(filename);
};

})(require('module'), require('path'), require('callsite'));

}
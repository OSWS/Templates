if(typeof exports === 'object') {

(function(Module, path, callsite) {

// (filebody: string, filepath: string) => // .T
// Only absolute filepath!
T.compile = function(filebody, filepath) {
    var template = new Module(filepath, module);
    template.filename = filepath;
    template.paths = Module._nodeModulePaths(path.dirname(filepath));
    template._compile(filebody, filepath);
    template.loaded = true;
    return template.T;
};

// (id: string) => // .T
// Only relative paths! No module names.
T.include = function(id) {
    var dirname = path.dirname(callsite()[1].getFileName());
    var filename = path.normalize(path.join(dirname, id));
    if(require.cache[filename]) delete require.cache[filename];
    return require(filename);
};

})(require('module'), require('path'), require('callsite'));

}
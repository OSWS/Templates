// Universal compiler.

module.exports = function(exports) {

// Context tool.
// new (compilation: Compilation) => this;
exports.CompilationContext = function CompilationContext(compilation) {
    this.compilation = compilation;
    
    this.deep = -1;
    
    // () => any;
    this.next = function() {
        if (this.deep == -1) {
            this.deep = 0;
            return this.compilation._context.apply(this, arguments);
        } else if (this.deep > -1) {
            for (var d = this.deep; d < this.compilation.tree.length; d++) {
                if (typeof(this.compilation.tree[d]) == 'object' && typeof(this.compilation.tree[d]._context) == 'function') {
                    var temp = this.extend();
                    temp.deep = d;
                    return this.compilation.tree[d]._context.apply(temp, arguments);
                }
            }
            return undefined;
        }
    }
    
    // () => any;
    this.prev = function() {
        if (this.deep == -1) {
            this.deep = 0;
            return this.compilation._context.apply(this, arguments);
        } else if (this.deep > -1) {
            for (var d = this.deep; d >= 0; d--) {
                if (typeof(this.compilation.tree[d]) == 'object' && typeof(this.compilation.tree[d]._context) == 'function') {
                    var temp = this.extend();
                    temp.deep = d;
                    return this.compilation.tree[d]._context.apply(temp, arguments);
                }
            }
            return undefined;
        }
    }
    
    // () => any;
    this.first = function() {
        if (this.deep > -1) {
            for (var d = 0; d < this.compilation.tree.length; d++) {
                if (typeof(this.compilation.tree[d]) == 'object' && typeof(this.compilation.tree[d]._context) == 'function') {
                    var temp = this.extend();
                    temp.deep = d;
                    return this.compilation.tree[d]._context.apply(temp, arguments);
                }
            }
            return undefined;
        }
    }
    
    // () => any;
    this.last = function() {
        if (this.deep > -1) {
            for (var d = this.compilation.tree.length - 1; d >= 0; d--) {
                if (typeof(this.compilation.tree[d]) == 'object' && typeof(this.compilation.tree[d]._context) == 'function') {
                    var temp = this.extend();
                    temp.deep = d;
                    return this.compilation.tree[d]._context.apply(temp, arguments);
                }
            }
            return undefined;
        }
    }
    
    // Create new compilation context tool.
    // () => CompilationContext;
    this.extend = function() {
        var temp = function() {};
        temp.prototype = this;
        return temp;
    };
}

// Info about compilation step and controller.
// new () => this;
exports.Compilation = function Compilation(data, context, callback) {
    var instance = this;
    
    this.result = '';
    
    this.whiler = false;
    
    this._context = context;
    
    this.deep = 0;
    this.tree = [data];
    this.branchs = [-1];
    this.direction = true; // true == down // false == up
    
    // Open one element without children.
    // (node: TData) => void;
    this.reset = function(node) {
        this.branchs[this.deep] = -2;
        this.direction = true;
        this.deep++;
        this.branchs[this.deep] = -1;
        this.tree[this.deep] = node;
    };
    
    // This done, go out.
    // (node: TData) => void;
    this.up = function(node) {
        this.result += node;
        this.tree.pop();
        this.branchs.pop();
        this.direction = false;
        this.deep--;
    };
    
    // Pause this, go in.
    // (node: TData) => void;
    this.down = function(node) {
        this.direction = true;
        this.deep++;
        this.branchs[this.deep] = -1;
        this.tree[this.deep] = node;
    };
    
    // Go next in this parent.
    // () => void;
    this.right = function() {
        this.branchs[this.deep]++;
        this.down(this.tree[this.deep][this.branchs[this.deep]]);
    };
    
    // Get context.
    // () => any;
    this.context = function() {
        var compilationContext = new exports.CompilationContext(this);
        return compilationContext.next.apply(compilationContext, arguments);
    }
    
    // Sync compile cicle.
    // () => void;
    this.while = function() {
        instance.whiler = true;
        while (instance.whiler) {
            if (instance.branchs[instance.deep] == -2) {
                instance.up('');
            } else if (instance.tree.length && instance.deep > -1) { // Available data to compile?
                if (typeof(instance.tree[instance.deep]) == 'function') { // is function?
                    if (instance.tree[instance.deep].prototype instanceof exports.Node) // of Compiler?
                        instance.reset(instance.tree[instance.deep].__construct());
                    else instance.up(String(instance.tree[instance.deep]));
                } else if (typeof(instance.tree[instance.deep]) == 'object') { // is object?
                    if (Object.prototype.toString.call(instance.tree[instance.deep]) === '[object Array]') { // is array?
                        if (instance.branchs[instance.deep] < instance.tree[instance.deep].length - 1)
                            instance.right();
                        else instance.up('');
                    } else if (
                        instance.tree[instance.deep] instanceof exports.Node
                        && instance.tree[instance.deep].__compile
                    ) { // of Compiler?
                        if (instance.tree[instance.deep] instanceof exports.async) {
                            instance.whiler = false;
                            instance.tree[instance.deep].__compile(instance, function(error, node) {
                                if (error) callback(error);
                                else {
                                    instance.reset(node);
                                    instance.while();
                                }
                            });
                        } else instance.reset(instance.tree[instance.deep].__compile(instance));
                    } else instance.up(String(instance.tree[instance.deep]));
                } else instance.up(String(instance.tree[instance.deep]));
            } else {
                instance.whiler = false;
                callback(null, instance.result);
            }
        }
    };
};

// (data: TData, context: TContext, callback: TCallback(error: any, result: string)) => void;
exports.compileAsync = function(data, context, callback) {
    var compilation = new exports.Compilation(data, context, callback);
    compilation.while();
};

// (data: TData, context: TContext) => string|throw Error;
exports.compileSync = function(data, context) {
    var result = new Error('Asynchrony can not be converted into synchronicity!');
    exports.compileAsync(data, context, function(error, data) {
        if (error) result = error;
        else result = data;
    });
    if (typeof(result) == 'object' && result instanceof Error) throw result;
    return result;
};

};
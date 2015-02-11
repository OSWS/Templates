(function(_, async) {

(function(Module, path, callsite) {

// (filebody: string, filepath: string) => // .exports
// Only absolute filepath!
exports.compile = function(filebody, filepath) {
    var template = new Module(filepath, module);
    template.filename = filepath;
    template.paths = Module._nodeModulePaths(path.dirname(filepath));
    template._compile(filebody, filepath);
    template.loaded = true;
    return template.exports;
};

// (id: string) => // .exports
// Only relative paths! No module names.
exports.include = function(id) {
    var dirname = path.dirname(callsite()[1].getFileName());
    var filename = path.normalize(path.join(dirname, id));
    if(require.cache[filename]) delete require.cache[filename];
    return require(filename);
};

})(require('module'), require('path'), require('callsite'));

// (...keys: string[]) => void
exports.static = function() {
    var _this = this;
    var _arguments = arguments;
    for (var a in _arguments) {
        (function(a) {
            _this[_arguments[a]] = function() {
                var i = _this.construct();
                return i[_arguments[a]].apply(i, arguments);
            };
        })(a);
    }
};

(function() {

// (argument: Function) => Function;
// unsafe
exports.sync = function(argument) {
    var sync = function() { return argument(); };
	sync.__templatesSync = true;
	sync.toString = function() {
	    return sync();
	};
	return sync;
};

// (argument: any) => boolean;
exports.isSyncFunction = function(argument) {
    return !!argument.__templatesSync;
};

})();

(function() {

// (argument: Function) => Function;
// unsafe
exports.async = function(argument) {
    var async = function(callback) { 
        var called = false;
        argument(function(error, result) {
            if (!called) {
                called = true;
                if (_.isFunction(callback)) callback(error, result);
            } else throw new Error('Repeated call callback unexpected!');
        });
    };
    async.__templatesAsync = true;
	async.toString = function() {
	    var _result = new Error('Asynchrony can not be converted into synchronicity!');
	    async(function(error, result) {
	        if (error) throw error;
	        else _result = result;
	    });
	    if (_.isObject(_result) && _result instanceof Error) throw _result;
	    return _result;
	};
	return async;
};

// (argument: any) => boolean;
exports.isAsyncFunction = function(argument) {
    return !!argument.__templatesAsync;
};

})();

(function() {

// new () => this;
exports.Prototype = function() {
    
    // Prototype;
    this._parent = undefined;

    // TArguments;
    this._arguments = undefined;
    
    // () => any;
    this.returner = function() { return this; };
    
    // (...arguments: TArguments) => any;
    this.constructor = function() {};

    // (...arguments: Array<TInjector|string>) => Function;
    this.extend = function() {
        var extendArguments = arguments;
        
        var injector = function() {
            for (var a in extendArguments) {
                if (_.isFunction(extendArguments[a])) extendArguments[a].call(this);
            }
        };
        
        var statics = [];
        
        for (var a in arguments) {
            if (_.isString(arguments[a])) statics.push(arguments[a]);
        }
        
        if (statics.length > 0) {
            var parent = this.extend(function() {
                var parent = this._parent;
                this._static = function() {
                    parent._static.call(this);
                    
                    exports.static.apply(this, statics);
                };
            }).construct();
        } else var parent = this;

        var _arguments = undefined;
        
        function Element() {
            if (this instanceof exports.Prototype) {

                if(_.isArguments(_arguments)) {
                    var __arguments = _arguments;
                    _arguments = undefined;
                } else {
                    var __arguments = arguments;
                }
                
                this._parent = parent;
                this._arguments = __arguments;
                
                injector.call(this);
                if (_.isFunction(this.constructor)) this.constructor.apply(this, __arguments);

            } else {
                _arguments = arguments;
                var instance = new Element();
                return instance.returner(instance);
            }
        };
        
        Element.prototype = parent;
        
        if (_.isFunction(parent._static)) {
            parent._static.call(Element);
        }
        
        return Element;
    };
    
    // () => void
    this._static = function() {
        this.toString = function() { return ''; };
        this.construct = function() { return this.apply(this, arguments); };
        exports.static.call(this, 'extend');
    }
};

})();

(function() {

// new () => this;
exports.Data = (new exports.Prototype()).extend('render', '_render', 'toString', 'prepend', 'data', 'append', function() {
    var parent = this._parent;
    
    // data
    
    // Array<TData>;
    this._data = undefined;

    // (...arguments: Array<TData>) => this;
    this.prepend = function() {
        this._data.unshift.apply(this._data, arguments);
        return this;
    };

    // (...arguments: Array<TData>) => this;
    this.data = function() {
        this._data = Array.prototype.slice.call(arguments);
        return this;
    };

    // (...arguments: Array<TData>) => this;
    this.append = function() {
        this._data.push.apply(this._data, arguments);
        return this;
    };
    
    // context
    
    // IContext;
    this._context = {};
    
    // (...arguments: Array<IContext>) => this;
    this.context = function() {
        for (var a in arguments) {
            _.extend(this._context, arguments[a]);
        };
        return this;
    };
    
    // constructor
    
    this.constructor = function() {
        parent.constructor.call(this);
        
        // data
        
        this._data = [];
        if (_.isArray(this._parent._data)) this._data = this._parent._data.slice(0);
        
        // context
        
        this._context = {};
    };
    
    // render
    
    // (...arguments: Array<TCallback{1}, IContext>) => TAsync(callback: TCallback) => void;
    this.render = function() {
        var callback = false;
        var context = {};
        
        for (var a in arguments) {
            if (_.isFunction(arguments[a])) callback = arguments[a];
            else if (_.isObject(arguments[a])) _.extend(context, arguments[a]); 
        }
        
        if (callback) this._render(callback, context);
        
        var instance = this;
        
        return exports.async(function(callback) {
            instance._render(callback, context);
        });
    };
    
    // (callback: TCallback, context: IContext) => this;
    this._render = function(callback, _context) {
        var context = _.extend({}, this._context);
        _.extend(context, _context);
        exports.render(this._data, function(error, result) {
            if (error) callback(error);
            else exports.render(context, function(error, renderedContext) {
                if (error) callback(error);
                else exports.renderContext(result.join(''), renderedContext, callback);
            }, context);
        }, context);
    };
    
    // () => string
    this.toString = function() {
        return String(this.render());
    };
});

exports.data = exports.Data.extend(function() {
    var parent = this._parent;
    
    this.constructor = function() {
        parent.constructor.apply(this);
        
        this.data.apply(this, arguments);
    };
});

})();

(function() {

// [new] (...arguments: Array<TSelector|IAttributes>) => this
exports.Tag = exports.Data.extend('name', 'attributes', 'selector', function() {
    var parent = this._parent;
    
    // name
    
    // TData;
    this._name = null;
    
    // (name: TData) => this;
    this.name = function(name) {
        this._name = name;
        return this;
    };
    
    // attributes

    // TAttributes;
    this._attributes = {};
    
    // (attributes: TAttributes) => this;
    this.attributes = function(attributes) {
        _.extend(this._attributes, attributes);
        return this;
    };
    
	// (selector: TSelector) => this;
	this.selector = function(selector) {
		exports.renderSelector(this._attributes, selector);
		return this;
	};
	
	// constructor
	
	this.constructor = function() {
	    parent.constructor.call(this);
	    
	    this._attributes = _.isObject(this._parent._attributes)? _.extend({}, this._parent._attributes) : {};
        
        for (var a in arguments) {
            if (_.isString(arguments[a])) this.selector(arguments[a]);
            else if (_.isObject(arguments[a])) this.attributes(arguments[a]);
        }
	};
	
	// render
	
    this._renderTag = function(name, data, attributes, callback) {
        callback(null, data);
    };
    
    this._render = function(callback, context) {
        var instance = this;
        
        parent._render.call(instance, function(error, result) {
            if (error) callback(error);
            else exports.renderAttributes(instance._attributes, function(error, attributes) {
                if (error) callback(error);
                else instance._renderTag(instance._name, result, attributes, callback);
            }, context);
        }, context);
    };
});

})();

(function() {

// [new] (...arguments: Array<TSelector|IAttributes>) => this;
exports.Single = exports.Tag.extend(function() {
    this._renderTag = function(name, data, attributes, callback) {
        callback(null, '<'+name + attributes+'/>');
    };
});

})();

(function() {

// [new] (...arguments: Array<TSelector|IAttributes>) => [new] (...arguments: Array<TData>) => this;
exports.Double = exports.Tag.extend(function() {
    this.construct = function() {
        return this()();
    };
    this._renderTag = function(name, data, attributes, callback) {
        callback(null, '<' + name + attributes + '>' + data + '</' + name + '>');
    };
    this.returner = function() {
        var instance = this;
        return instance.extend(function() {
            this.constructor = function() {
                if (arguments.length > 0) instance.data.apply(instance, arguments);
            };
            this.returner = function() { return instance; };
        });
    };
});

})();

(function() {

// [new] (...arguments: Array<TSelector|IAttributes>) => this;
exports.Doctype = exports.Tag.extend(function() {
    this._name = 'DOCTYPE';
    this._renderTag = function(name, data, attributes, callback) {
        callback(null, '<!' + name + attributes + '>');
    };
});

})();

(function() {

// [new] (...arguments: Array<TSelector|IAttributes>) => this;
exports.xml = exports.Tag.extend(function() {
    this._name = 'xml';
    this._renderTag = function(name, data, attributes, callback) {
        callback(null, '<?' + name + attributes + '?>');
    };
});

})();

(function() {

exports._singles = ['br', 'hr', 'img', 'input', 'base', 'frame', 'link', 'meta', 'style'];

exports.singles = {};

for (var key in exports._singles) {
    exports.singles[exports._singles[key]] = exports.Single().name(exports._singles[key]).extend();
}

})();

(function() {

exports._doubles = ['html', 'body', 'head', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hgroup', 'div', 'p', 'address', 'blockquote', 'pre', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'fieldset', 'legend', 'form', 'noscript', 'object', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'col', 'colgroup', 'caption', 'span', 'b', 'big', 'strong', 'i', 'var', 'cite', 'em', 'q', 'del', 's', 'strike', 'tt', 'code', 'kbd', 'samp', 'small', 'sub', 'sup', 'dfn', 'bdo', 'abbr', 'acronym', 'a', 'button', 'textarea', 'select', 'option', 'article', 'aside', 'figcaption', 'figure', 'footer', 'header', 'section', 'main', 'nav', 'menu', 'audio', 'video', 'embed', 'canvas', 'output', 'details', 'summary', 'mark', 'meter', 'progress', 'template', 'comment', 'title', 'script'];

exports.doubles = {};

for (var key in exports._doubles) {
    exports.doubles[exports._doubles[key]] = exports.Double()().name(exports._doubles[key]).extend();
}

})();

(function() {

exports.Mixin = exports.Data().extend();

// (reconstructor: Function) => Content;
exports.mixin = function(reconstructor) {
	if (!_.isFunction(reconstructor)) throw new Error('reconstructor must be a function');
	
	return exports.Mixin().extend(function() {
		var parent = this._parent;
		
		this.constructor = function() {
			parent.constructor.apply(this);
			
			this.data(reconstructor.apply(this, arguments));
		};
	});
};

})();

(function() {

// (data: TData, callback: TCallback, context?: TContext) => void
exports.render = function(data, callback, context) {
    if (_.isFunction(data)) {
        if (exports.isSyncFunction(data)) callback(null, data());
        else if (exports.isAsyncFunction(data)) data(function(error, result) { callback(error, result); });
        else if (data.prototype instanceof exports.Data) data._render(callback, context);
        else callback(null, data);
    } else if (_.isObject(data)) {
        if (data instanceof exports.Data) data._render(callback, context);
        else callback(null, data);
    } else callback(null, data);
};

// (string: string, context: Object, callback: TCallback) => void;
exports.renderContext = function(string, context, callback) {
    callback(null, _.template(string, context));
};

// (attributes: TAttributes, callback: TCallback, context: IContext) => void
exports.renderAttributes = function(attributes, callback, context) {
    exports.render(attributes, function(error, attributes) {
        if (error) callback(error);
        else {
            var result = '';
            
            for (var key in attributes) {
                if (_.isNull(attributes[key])) result += ' '+key;
                else result += ' '+key+'="'+attributes[key]+'"';
            }
            
            callback(null, result);
        }
    }, context);
};

// (data: string, reg: RegExp) => string[][];
exports.regExpSearch = function(data, reg) {
    var result = [], temp = null;
    while ((temp = reg.exec(data)) != null) {
        if (temp.index === reg.lastIndex) reg.lastIndex++;
        result.push(temp);
    }
    return result;
}

// https://www.regex101.com/r/cM5jC6/9
exports._renderSelectorRegExp = (/(\[)|(\])|#([-\w\d]+)|\.([-\w\d]+)|([\w\d-]+)="(['\w\d\s-:\\\/\.\,\]\[={}<>%@#$%^&*~`]*)"|([\w\d-]+)='(["\w\d\s-:\\\/\.\,\]\[={}<>%@#$%^&*~`]*)'|([\w\d-]+)=([\w\d-:\\\/\.={}<>%@#$%^&*~`]*)|("['\w\d\s-:\\\/\.\,\]\[={}<>%@#$%^&*~`]+")|('["\w\d\s-:\\\/\.\,\]\[={}<>%@#$%^&*~`]+')|([_\w-:\\\/]+)/g);

// (attributes: IAttributes, selector: TSelector) => void;
exports.renderSelector = function(attributes, selector) {
    var matchs = exports.regExpSearch(selector, exports._renderSelectorRegExp);
    var isAttr = false;
    _.each(matchs, function(node) {
        if (node[1]) { isAttr = true; return; } // [
        else if (node[2]) { isAttr = false; return; } // ]

        if (isAttr) {
            if (node[9]) { attributes[node[9]] = node[10]; return; } // attr=value
            if (node[7]) { attributes[node[7]] = node[8]; return; } // attr='value'
            if (node[5]) { attributes[node[5]] = node[6]; return; } // attr="value"
            if (node[13]) { attributes[node[13]] = null; return; } // [attr]
            if (node[12]) { attributes[node[12]] = null; return; } // ['attr']
            if (node[11]) { attributes[node[11]] = null; return; } // ["attr"]
        } else {
            if (node[3]) { attributes.id = node[3]; return; } // id
            if (node[4]) { attributes.class? attributes.class += ' ' + node[4] : attributes.class = node[4]; return; } // class
        }
    });
};

})();

})(require('lodash'), require('async'));

//# sourceMappingURL=index.js.map
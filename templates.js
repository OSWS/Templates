(function(factory) {
    if(typeof define === 'function' && define.amd) {
        define(['module', 'lodash'], function(module, _) {
            module.exports = factory({}, _);
        });
    } else if(typeof exports === 'object') {
        module.exports = factory({}, require('lodash'));
    }
})(function(T, _) {

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

// (...keys: string[]) => void
T.static = function() {
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

// (data: TData, callback: TCallback, context?: TContext) => void
T.render = function(data, callback, context) {
    if (_.isFunction(data)) {
        if (T.isSyncFunction(data)) callback(null, data());
        else if (T.isAsyncFunction(data)) data(function(error, result) { callback(error, result); });
        else if (data.prototype instanceof T.Data) data._render(callback, context);
        else callback(null, data);
    } else if (_.isObject(data)) {
        if (data instanceof T.Data) data._render(callback, context);
        else callback(null, data);
    } else callback(null, data);
};

// (string: string, context: Object, callback: TCallback) => void;
T.renderContext = function(string, context, callback) {
    callback(null, _.template(string, context));
};

// (attributes: TAttributes, callback: TCallback, context: IContext) => void
T.renderAttributes = function(attributes, callback, context) {
    T.render(attributes, function(error, attributes) {
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
T.regExpSearch = function(data, reg) {
    var result = [], temp = null;
    while ((temp = reg.exec(data)) != null) {
        if (temp.index === reg.lastIndex) reg.lastIndex++;
        result.push(temp);
    }
    return result;
}

// https://www.regex101.com/r/cM5jC6/9
T._renderSelectorRegExp = (/(\[)|(\])|#([-\w\d]+)|\.([-\w\d]+)|([\w\d-]+)="(['\w\d\s-:\\\/\.\,\]\[={}<>%@#$%^&*~`]*)"|([\w\d-]+)='(["\w\d\s-:\\\/\.\,\]\[={}<>%@#$%^&*~`]*)'|([\w\d-]+)=([\w\d-:\\\/\.={}<>%@#$%^&*~`]*)|("['\w\d\s-:\\\/\.\,\]\[={}<>%@#$%^&*~`]+")|('["\w\d\s-:\\\/\.\,\]\[={}<>%@#$%^&*~`]+')|([_\w-:\\\/]+)/g);

// (attributes: IAttributes, selector: TSelector) => void;
T.renderSelector = function(attributes, selector) {
    var matchs = T.regExpSearch(selector, T._renderSelectorRegExp);
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

(function() {

// (argument: Function) => Function;
// unsafe
T.sync = function(argument) {
    var sync = function() { return argument(); };
	sync.__templatesSync = true;
	sync.toString = function() {
	    return sync();
	};
	return sync;
};

// (argument: any) => boolean;
T.isSyncFunction = function(argument) {
    return !!argument.__templatesSync;
};

})();

(function() {

// (argument: Function) => Function;
// unsafe
T.async = function(argument) {
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
T.isAsyncFunction = function(argument) {
    return !!argument.__templatesAsync;
};

})();

(function() {

// new () => this;
T.Prototype = function() {
    
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
                    
                    T.static.apply(this, statics);
                };
            }).construct();
        } else var parent = this;

        var _arguments = undefined;
        
        function Element() {
            if (this instanceof T.Prototype) {

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
        T.static.call(this, 'extend');
    }
};

})();

(function() {

// new () => this;
T.Data = (new T.Prototype()).extend('render', '_render', 'toString', 'prepend', 'data', 'append', function() {
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
        
        return T.async(function(callback) {
            instance._render(callback, context);
        });
    };
    
    // (callback: TCallback, context: IContext) => this;
    this._render = function(callback, _context) {
        var context = _.extend({}, this._context);
        _.extend(context, _context);
        T.render(this._data, function(error, result) {
            if (error) callback(error);
            else T.render(context, function(error, renderedContext) {
                if (error) callback(error);
                else T.renderContext(result.join(''), renderedContext, callback);
            }, context);
        }, context);
    };
    
    // () => string
    this.toString = function() {
        return String(this.render());
    };
});

T.data = T.Data.extend(function() {
    var parent = this._parent;
    
    this.constructor = function() {
        parent.constructor.apply(this);
        
        this.data.apply(this, arguments);
    };
});

})();

(function() {

// [new] (...arguments: Array<TSelector|IAttributes>) => this
T.Tag = T.Data.extend('name', 'attributes', 'selector', function() {
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
		T.renderSelector(this._attributes, selector);
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
            else T.renderAttributes(instance._attributes, function(error, attributes) {
                if (error) callback(error);
                else instance._renderTag(instance._name, result, attributes, callback);
            }, context);
        }, context);
    };
});

})();

(function() {

// [new] (...arguments: Array<TSelector|IAttributes>) => this;
T.Single = T.Tag.extend(function() {
    this._renderTag = function(name, data, attributes, callback) {
        callback(null, '<'+name + attributes+'/>');
    };
});

})();

(function() {

T._singles = ['br', 'hr', 'img', 'input', 'base', 'frame', 'link', 'meta', 'style'];

T.singles = {};

for (var key in T._singles) {
    T.singles[T._singles[key]] = T.Single().name(T._singles[key]).extend();
}

})();

(function() {

// [new] (...arguments: Array<TSelector|IAttributes>) => [new] (...arguments: Array<TData>) => this;
T.Double = T.Tag.extend(function() {
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

T._doubles = ['html', 'body', 'head', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hgroup', 'div', 'p', 'address', 'blockquote', 'pre', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'fieldset', 'legend', 'form', 'noscript', 'object', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'col', 'colgroup', 'caption', 'span', 'b', 'big', 'strong', 'i', 'var', 'cite', 'em', 'q', 'del', 's', 'strike', 'tt', 'code', 'kbd', 'samp', 'small', 'sub', 'sup', 'dfn', 'bdo', 'abbr', 'acronym', 'a', 'button', 'textarea', 'select', 'option', 'article', 'aside', 'figcaption', 'figure', 'footer', 'header', 'section', 'main', 'nav', 'menu', 'audio', 'video', 'embed', 'canvas', 'output', 'details', 'summary', 'mark', 'meter', 'progress', 'template', 'comment', 'title', 'script'];

T.doubles = {};

for (var key in T._doubles) {
    T.doubles[T._doubles[key]] = T.Double()().name(T._doubles[key]).extend();
}

})();

(function() {

// [new] (...arguments: Array<TSelector|IAttributes>) => this;
T.Doctype = T.Tag.extend(function() {
    this._name = 'DOCTYPE';
    this._renderTag = function(name, data, attributes, callback) {
        callback(null, '<!' + name + attributes + '>');
    };
});

})();

(function() {

T.doctypes = {};

T.doctypes.html = T.Doctype('[html]').extend();
T.doctypes.transitional = T.Doctype('[html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"]').extend();
T.doctypes.strict = T.Doctype('[html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"').extend();
T.doctypes.frameset = T.Doctype('[html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd"]').extend();
T.doctypes.basic = T.Doctype('[html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd"]').extend();
T.doctypes.mobile = T.Doctype('[html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd"]').extend();

})();

(function() {

// [new] (...arguments: Array<TSelector|IAttributes>) => this;
T.xml = T.Tag.extend(function() {
    this._name = 'xml';
    this._renderTag = function(name, data, attributes, callback) {
        callback(null, '<?' + name + attributes + '?>');
    };
});

})();

(function() {

T.Mixin = T.Data().extend();

// (reconstructor: Function) => Content;
T.mixin = function(reconstructor) {
	if (!_.isFunction(reconstructor)) throw new Error('reconstructor must be a function');
	
	return T.Mixin().extend(function() {
		var parent = this._parent;
		
		this.constructor = function() {
			parent.constructor.apply(this);
			
			this.data(reconstructor.apply(this, arguments));
		};
	});
};

})();

(function() {

T.with = {};

T.with.Mixin = T.Mixin;
T.with.mixin = T.mixin;

T.with.data = T.data;
T.with.Data = T.Data;

T.with.xml = T.xml;

T.with.doctypes = T.doctypes;
T.with.Doctype = T.Doctype;

_.extend(T.with, T.singles);
T.with.Single = T.Single;

_.extend(T.with, T.doubles);
T.with.Double = T.Double;

T.with.sync = T.sync;
T.with.async = T.async;

})();

return T;

});

//# sourceMappingURL=templates.js.map
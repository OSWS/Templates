(function() {

// [new] (...arguments: Array<TSelector|TAttributes>) => this
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
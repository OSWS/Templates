(function() {

// Array data managment from instance or static element.

// Not intended for use immediately! Only inheritance!

// [new] () => this;
T.Data = T.Renderer.extend('prepend', 'append', function() {
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
    
    // constructor
    
    this.constructor = function() {
        parent.constructor.call(this);
        
        // data
        
        this._data = [];
        if (_.isArray(this._parent._data)) this._data = this._parent._data.slice(0);
    };
});

// Useful extension.

T.data = T.Data.extend(function() {
    var parent = this._parent;
    
    this.constructor = function() {
        parent.constructor.apply(this);
        
        this.data.apply(this, arguments);
    };
});

})();
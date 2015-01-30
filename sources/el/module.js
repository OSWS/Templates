// (data: TData) => Module
var Module = exports.Module = Content().extend(function() {
    var parent = this._parent;
    
    var extending = function() {
        
        // (...arguments: any[]) => Module instance
        this.constructor = function() {
            parent.constructor.apply(this);
            
            if (_.isFunction(this._data) && this._data.prototype instanceof Mixin) this._result = content(this._data.apply(this._data, arguments));
            else this._result = content(this._data);
        };
        this.returner = function() {
            return this;
        }
    };
    
    this.constructor = function(data) {
        this._data = data;
    };
    
    this.returner = function() {
        return this.extend(extending);
    };
    
    this.render = function() {
        this._result.render.apply(this._result, arguments);
    };
});

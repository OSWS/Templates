(function() {

T.mixins = {
	
	// (src: string|function, ...arguments: Array<TSelector, TAttributes>)
	js: T.mixin(function(src) {
		var script = T.doubles.script('[type="text/javascript"]');
		
		if (typeof src === 'string') script.attributes({ src: src });
		else if (typeof src === 'function') {
			var str = String(src);
			script.data(str.substring(str.indexOf("{") + 1, str.lastIndexOf("}")));
		} else throw new Error('Unexpected src.');
		
		var args = Array.prototype.slice.call(arguments, 1);
		
		for (var a in args) {
            if (_.isString(args[a])) script.selector(args[a]);
            else if (_.isObject(args[a])) script.attributes(args[a]);
        }
        
        return script;
	}), 
	
	// (href: string|function, ...arguments: Array<TSelector, TAttributes>)
	css: T.mixin(function(href) {
		var link = T.singles.link('[rel="stylesheet"]');
		
		if (typeof href === 'string') link.attributes({ href: href });
		else throw new Error('Unexpected href.');
		
		var args = Array.prototype.slice.call(arguments, 1);
		
		for (var a in args) {
            if (_.isString(args[a])) link.selector(args[a]);
            else if (_.isObject(args[a])) link.attributes(args[a]);
        }
        
        return link;
	})
};

})();
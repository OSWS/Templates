// Universal compiler.

module.exports = function(exports) {
    
    var async = require('async');
    
    // (data: TData, context: Object <= TContext, callback: TCallback) => void =>> string;
    exports.compileData = function(data, context, callback) {
        
        var whiler = true;
        
        var result = '';
        
        var deep = 0;
        var vertical = [data];
        var horizontal = [-1];
        
        var direction = true;
        // true // down
        // false // up
        
        var reset = function(node) {
            vertical[deep] = node;
        };
        
        var up = function(node) {
            result += node;
            vertical.pop();
            horizontal.pop();
            direction = false;
            deep--;
        };
        
        var down = function(node) {
            direction = true;
            deep++;
            horizontal[deep] = -1;
            vertical[deep] = node;
        };
        
        var right = function() {
            horizontal[deep]++;
            down(vertical[deep][horizontal[deep]]);
        };
        
        var out = function() {
            direction = false;
            deep--;
        };
        
        var core = function() {
            whiler = true;
            while (whiler) {
                if (vertical.length && deep > -1) { // Available data to compile?
                    if (typeof(vertical[deep]) == 'function') { // is function?
                        if (vertical[deep].prototype instanceof exports.Compiler) // of Compiler?
                            vertical[deep] = vertical[deep].__construct();
                        else if (exports.isSyncFunction(vertical[deep])) // is sync?
                            vertical[deep] = vertical[deep].call(context);
                        else if (exports.isAsyncFunction(vertical[deep])) { // is async?
                            whiler = false;
                            vertical[deep].call(context, function(error, node) {
                                if (error) callback(error);
                                else {
                                    reset(node);
                                    core();
                                }
                            });
                        } else if (exports.isContextFunction(vertical[deep])) // is context?
                            vertical[deep] = vertical[deep].__construct();
                        else up(String(vertical[deep]));
                    } else if (typeof(vertical[deep]) == 'object') { // is object?
                        if (Object.prototype.toString.call(vertical[deep]) === '[object Array]') { // is array?
                            if (horizontal[deep] < vertical[deep].length - 1)
                                right();
                            else out();
                        } else if (vertical[deep] instanceof exports.Compiler) { // of Compiler?
                            if (vertical[deep].__compile) reset(vertical[deep].__compile(context));
                            else up(String(vertical[deep]));
                        } else up(String(vertical[deep]));
                    } else up(String(vertical[deep]));
                } else {
                    whiler = false;
                    callback(null, result);
                }
            }
        };
        
        core();
    };
};
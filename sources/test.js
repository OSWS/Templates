describe(require('../package.json').name+'@'+require('../package.json').version, function() {
    require('./class/test');
    
    require('./static/test');
    
    require('./compile/test');
    
    require('./node/test');
    
    require('./async/test');
    require('./sync/test');
    
    require('./data/test');
    
    require('./mixin/test');
});
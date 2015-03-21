require('./class')(exports);

require('./static')(exports);

require('./compile')(exports);

require('./node')(exports);

require('./async')(exports);
require('./sync')(exports);

require('./data')(exports);

if (typeof(window) == 'object') window['oswst'] = module.exports;
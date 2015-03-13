// Rules.

// Comments with instructions in the style of language TypeScript.
// => return
// =>> callback

// ._key
// Utilitarian option, not intended for user use.

// .__key
// Utilitarian function, not intended for user use.

// .___key
// Additional Information. Read-only.

// type TData = sync|async|Compiler|any;
// sync|async =>> TData;
// Compiler =>> string;
// string|number =>> string;
// boolean|undefined|null =>> string; // ''
// {} =>> string; // String({}) =>> '[object Object]'
// [] =>> string; // [ 123, 456 ] =>> 123456

require('./class/index.js')(module.exports);
require('./static/index.js')(module.exports);
require('./compile/index.js')(module.exports);
require('./sync/index.js')(module.exports);
require('./async/index.js')(module.exports);
require('./compiler/index.js')(module.exports);
require('./context/index.js')(module.exports);
require('./data/index.js')(module.exports);

if (typeof(window) == 'object') window['oswst'] = module.exports;
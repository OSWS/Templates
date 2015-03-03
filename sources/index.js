// Rules.

// Comments with instructions in the style of language TypeScript.

// ._key
// Utilitarian option, not intended for user use.

// .__key
// Utilitarian function, not intended for user use.

// .___key
// Additional Information. Read-only.

require('./class/index.js')(module.exports);
require('./static/index.js')(module.exports);
require('./compile/index.js')(module.exports);
require('./sync/index.js')(module.exports);
require('./async/index.js')(module.exports);
require('./compiler/index.js')(module.exports);
require('./context/index.js')(module.exports);
require('./data/index.js')(module.exports);
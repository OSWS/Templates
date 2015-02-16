// Check native require.
var T = require('../../');
// Check Templates.include.
if (T.include('include1.js') != __dirname + '/include1.js') throw new Error('Unexpected T.');
// Export test string.
module.exports = __filename;
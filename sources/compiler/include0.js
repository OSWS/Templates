// Check native require.
var T = require('../../');
var path = require('path');

// Check Templates.include.
if (T.include('include1.js') != path.join(__dirname, '/include1.js')) throw new Error(T.include('include1.js') + ' != ' + path.join(__dirname, '/include1.js'));
// Export test string.
module.exports = __filename;
var T = require('../../');

if (T.include('include1.js') != __dirname + '/include1.js') throw new Error('Unexpected T.');

module.exports = __filename;
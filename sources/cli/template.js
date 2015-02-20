var T = require('../../');

with (T.with) {

module.exports = div()(1, '<%= a %>', 3).context({ a: 2 });

}
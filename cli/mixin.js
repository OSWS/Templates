var T = require('../templates.js');

with (T.with) {

module.exports = mixin(function(a){
    return data(1, a, '<%= b %>');
});

}
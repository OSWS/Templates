exports.with = {};

exports.with.mixin = exports.mixin;
exports.with.content = exports.content;
exports.with.doctype = exports.doctypes;
_.extend(exports.with, exports.singles);
_.extend(exports.with, exports.doubles);
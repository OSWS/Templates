exports.with = {};

exports.with.Mixin = exports.Mixin;
exports.with.mixin = exports.mixin;

exports.with.content = exports.content;
exports.with.Content = exports.Content;

exports.with.doctype = exports.doctypes;
exports.with.Doctype = exports.Doctype;

_.extend(exports.with, exports.singles);
exports.with.Single = exports.Single;

_.extend(exports.with, exports.doubles);
exports.with.Double = exports.Double;

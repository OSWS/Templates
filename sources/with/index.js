(function() {

T.with = {};

T.with.Mixin = T.Mixin;
T.with.mixin = T.mixin;

T.with.data = T.data;
T.with.Data = T.Data;

T.with.xml = T.xml;

T.with.doctypes = T.doctypes;
T.with.Doctype = T.Doctype;

_.extend(T.with, T.singles);
T.with.Single = T.Single;

_.extend(T.with, T.doubles);
T.with.Double = T.Double;

T.with.sync = T.sync;
T.with.async = T.async;

})();
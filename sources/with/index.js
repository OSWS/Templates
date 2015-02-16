(function() {

T.with = {};

T.with.sync = T.sync;
T.with.async = T.async;

T.with.Renderer = T.Renderer;

T.with.data = T.data;
T.with.Data = T.Data;

T.with.xml = T.xml;

T.with.doctypes = T.doctypes;
T.with.Doctype = T.Doctype;

_.extend(T.with, T.singles);
T.with.Single = T.Single;

_.extend(T.with, T.doubles);
T.with.Double = T.Double;

T.with.Mixin = T.Mixin;
T.with.mixin = T.mixin;

_.extend(T.with, T.mixins);

T.with.Module = T.Module;

})();
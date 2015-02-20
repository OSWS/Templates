var C = require('colors');

console.log(C.gray('OSWS Templates'), C.blue('CLI'));

var commander = require('commander');

commander
.version(require('../../package.json').version)
.option('-s, --source <path>', 'Specify source files. By default - all in this directory.', '*.js')
.option('-d, --dest <path>', 'Set output directory. By default - this directory.')
.option('-w, --watch', 'Watch to source files.')
.option('-c, --context [json]', 'Specify context.')
.option('-a, --arguments [json]', 'Specify arguments.')
.option('-u, --auto-exit', 'Enable auto exit by pressing Enter.')
.option('--dirname <path>', 'Specify gulp-rename option.')
.option('--basename <path>', 'Specify gulp-rename option.')
.option('--prefix <path>', 'Specify gulp-rename option.')
.option('--suffix <path>', 'Specify gulp-rename option.')
.option('-e, --extname <path>', 'Specify gulp-rename option.', '.html')
.parse(process.argv);

var fs = require('fs');
var gulp = require('gulp');
var debug = require('gulp-debug');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var templates = require('gulp-oswst');
var _ = require('lodash');
var path = require('path');

if (!commander.source) throw new Error('!source');

if (!commander.dest) commander.dest = path.dirname(commander.source);

console.log('source:', C.blue(commander.source));

console.log('dest:', C.blue(commander.dest));
console.log('watch:', commander.watch ? C.green(true) : C.red(false));
console.log('auto exit:', commander.autoExit ? C.green(true) : C.red(false));

if (commander.dirname) console.log('dirname', C.blue(commander.dirname));
if (commander.basename) console.log('basename', C.blue(commander.basename));
if (commander.prefix) console.log('prefix', C.blue(commander.prefix));
if (commander.suffix) console.log('suffix', C.blue(commander.suffix));
if (commander.extname) console.log('extname', C.blue(commander.extname));

if (commander.context) console.log('context', C.blue(commander.context));
if (commander.arguments) console.log('arguments', C.blue(commander.arguments));

function json(input) {
  try {
        var str = fs.readFileSync(input);
  } catch (error) {
        return eval('(' + input + ')');
  }
  return JSON.parse(str);
}

var options = {};
if (_.isString(commander.context)) options.context = json(commander.context);
if (_.isString(commander.arguments)) options.arguments = json(commander.arguments);

gulp.task('compile', function() {
    gulp.src(commander.source)
    .pipe(debug({ title: 'source:' }))
    .pipe(plumber())
    .pipe(templates(options))
    .pipe(rename(function(path) {
        if (commander.dirname) path.dirname = commander.dirname;
        if (commander.basename) path.basename = commander.basename;
        if (commander.prefix) path.prefix = commander.prefix;
        if (commander.suffix) path.suffix = commander.suffix;
        if (commander.extname) path.extname = commander.extname;
    }))
    .pipe(debug({ title: 'target:' }))
    .pipe(gulp.dest(commander.dest))
});

gulp.start('compile');

if (commander.watch) {
    gulp.watch(commander.source, ['compile']);
}

if (commander.autoExit) {
    process.stdin.on("data", process.exit);
}
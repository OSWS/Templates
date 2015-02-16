var commander = require('commander');

commander
.version(require('./package.json').version)
.option('-s, --source <path>', 'Specify source files. By default - all in this directory.')
.option('-d, --dest <path>', 'Set output directory. By default - this directory.')
.option('-w, --watch', 'Watch to source files.')
.option('-a, --auto-exit', 'Enable auto exit by pressing Enter.')
.option('--dirname <path>', 'Specify gulp-rename option.')
.option('--basename <path>', 'Specify gulp-rename option.')
.option('--prefix <path>', 'Specify gulp-rename option.')
.option('--suffix <path>', 'Specify gulp-rename option.')
.option('--extname <path>', 'Specify gulp-rename option.')
.parse(process.argv)

var gulp = require('gulp');
var debug = require('gulp-debug');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var templates = require('gulp-osws-templates');
var _ = require('lodash');
var C = require('colors');
var path = require('path');

if (!commander.source) throw new Error('!source');

if (!commander.dest) commander.dest = path.dirname(commander.source);

console.log('source:', C.blue(commander.source));

console.log('dest:', C.blue(commander.dest));
console.log('watch:', commander.watch ? C.green(true) : C.red(false));
console.log('auto exit:', commander.autoExit ? C.green(true) : C.red(false));

console.log('dirname', commander.dirname? C.blue(commander.dirname) : C.gray(undefined));
console.log('basename', commander.basename? C.blue(commander.basename) : C.gray(undefined));
console.log('prefix', commander.prefix? C.blue(commander.prefix) : C.gray(undefined));
console.log('suffix', commander.suffix? C.blue(commander.suffix) : C.gray(undefined));
console.log('extname', commander.extname? C.blue(commander.extname) : C.gray(undefined));

gulp.task('compile', function() {
    gulp.src(commander.source)
    .pipe(debug({ title: 'source:' }))
    .pipe(plumber())
    .pipe(templates())
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
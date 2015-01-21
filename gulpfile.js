var gulp = require('gulp');
var concat = require('gulp-concat');
var typescript = require('gulp-typescript');
var mocha = require('gulp-mocha');
var plumber = require('gulp-plumber');
var logger = require('gulp-logger');

gulp.task('default', ['templates']);

gulp.task('templates', ['templates-concat', 'templates-watch']);

gulp.task('templates-concat', function() {

	gulp.src([
		'sources/commonjs-open.js',
		'sources/selector.js',
		'sources/data.js',
		'sources/prototypes/prototype.js',
		'sources/prototypes/contents.js',
		'sources/prototypes/tag.js',
		'sources/prototypes/single.js',
		'sources/prototypes/double.js',
		'sources/prototypes/doctype.js',
		'sources/implementations/doctype.js',
		'sources/implementations/single.js',
		'sources/implementations/double.js',
		'sources/implementations/content.js',
		'sources/implementations/struct.js',
	])
	.pipe(plumber())
	.pipe(concat('index.js'))
	.pipe(gulp.dest('./'));
	
	gulp.src([
		'sources/amd-open.js',
		'sources/selector.js',
		'sources/data.js',
		'sources/prototypes/prototype.js',
		'sources/prototypes/contents.js',
		'sources/prototypes/tag.js',
		'sources/prototypes/single.js',
		'sources/prototypes/double.js',
		'sources/prototypes/doctype.js',
		'sources/implementations/doctype.js',
		'sources/implementations/single.js',
		'sources/implementations/double.js',
		'sources/implementations/content.js',
		'sources/implementations/struct.js',
		'sources/amd-close.js'
	])
	.pipe(plumber())
	.pipe(concat('templates.js'))
	.pipe(gulp.dest('./'));
});

gulp.task('templates-watch', function() {
	gulp.watch(['sources/*', 'sources/**/*'], ['templates-concat']);
});

// gulp.task('tests', ['tests-compile', 'tests-mocha', 'tests-watch']);

// gulp.task('tests-compile', function() {
// 	gulp.src(['tests/test.ts'])
// 	.pipe(plumber())
// 	.pipe(logger({ extname: '.ts' }))
// 	.pipe(typescript())
// 	.pipe(gulp.dest('./tests/'));
// });

// gulp.task('tests-mocha', function() {
// 	gulp.src(['tests/test.js'], {read: false})
// 	.pipe(plumber())
// 	.pipe(mocha())
// });

// gulp.task('tests-watch', function() {
// 	gulp.watch(['tests/*.ts'], ['tests-compile', 'tests-mocha']);
// });

process.stdin.on("data", process.exit);
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');
var plumber = require('gulp-plumber');
var logger = require('gulp-logger');

gulp.task('default', ['templates']);

gulp.task('templates', ['templates-concat-commonjs', 'templates-concat-amd', 'templates-minify-amd', 'templates-watch']);

gulp.task('templates-concat-commonjs', function() {
	gulp.src([
		'sources/commonjs-open.js',

		'sources/index.js',
		'sources/el/prototype.js',
		'sources/el/content.js',
		'sources/content.js',
		'sources/el/tag.js',
		'sources/el/single.js',
		'sources/el/double.js',
		'sources/el/doctype.js',
		'sources/doctypes.js',
		'sources/singles.js',
		'sources/doubles.js',
		'sources/with.js'
	])
	.pipe(plumber())
	.pipe(concat('index.js'))
	.pipe(gulp.dest('./'));
});

gulp.task('templates-concat-amd', function() {
	gulp.src([
		'sources/amd-open.js',

		'sources/index.js',
		'sources/el/prototype.js',
		'sources/el/content.js',
		'sources/content.js',
		'sources/el/tag.js',
		'sources/el/single.js',
		'sources/el/double.js',
		'sources/el/doctype.js',
		'sources/doctypes.js',
		'sources/singles.js',
		'sources/doubles.js',
		'sources/with.js',

		'sources/amd-close.js'
	])
	.pipe(plumber())
	.pipe(concat('templates.js'))
	.pipe(gulp.dest('./'));
});

gulp.task('templates-minify-amd', function() {
	gulp.src('templates.js')
	.pipe(plumber())
	.pipe(uglify())
	.pipe(concat('templates.min.js'))
	.pipe(gulp.dest('./'));
});

gulp.task('templates-watch', function() {
	gulp.watch(['sources/*', 'sources/**/*'], ['templates-concat-commonjs', 'templates-concat-amd', 'templates-minify-amd']);
});

process.stdin.on("data", process.exit);
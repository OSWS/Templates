var gulp = require('gulp');
var uglify = require('gulp-uglifyjs');
var debug = require('gulp-debug');
var plumber = require('gulp-plumber');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');

var path = require('path');
var fs = require('fs');

gulp.task('sources-browserify-watch', function() {
	gulp.watch(['./sources/index.js', './sources/**/index.js'], ['sources-browserify-compile']);
});

gulp.task('sources-browserify-compile', function() {
	gulp.src('./sources/index.js')
	.pipe(debug({ title: 'browserify: ' }))
	.pipe(browserify())
	.pipe(rename(require('./package.json').name+'.js'))
	.pipe(gulp.dest('./browser'))
});

gulp.task('sources-minify-watch', function() {
	gulp.watch(['./browser/'+require('./package.json').name+'.js'], ['sources-minify-compile']);
});

gulp.task('sources-minify-compile', function() {
	gulp.src('./browser/'+require('./package.json').name+'.js')
	.pipe(debug({ title: 'minify: ' }))
	.pipe(uglify())
	.pipe(rename(require('./package.json').name+'.min.js'))
	.pipe(gulp.dest('./browser'))
});

gulp.task('tests-browserify-watch', function() {
	gulp.watch(['./sources/test.js', './sources/**/test.js'], ['tests-browserify-compile']);
});

gulp.task('tests-browserify-compile', function() {
	gulp.src('./sources/test.js')
	.pipe(debug({ title: 'tests: ' }))
	.pipe(browserify())
	.pipe(rename('tests.js'))
	.pipe(gulp.dest('./browser'))
});

gulp.task('default', ['sources-browserify-compile', 'tests-browserify-compile', 'sources-browserify-watch', 'sources-minify-watch', 'tests-browserify-watch']);

process.stdin.on("data", process.exit);
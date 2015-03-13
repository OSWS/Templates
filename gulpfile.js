var gulp = require('gulp');
var uglify = require('gulp-uglifyjs');
var debug = require('gulp-debug');
var plumber = require('gulp-plumber');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');

var path = require('path');
var fs = require('fs');

gulp.task('sources-compile', function() {
	gulp.src('./sources/index.js')
	.pipe(browserify())
	.pipe(rename(require('./package.json').name+'.js'))
	.pipe(gulp.dest('./'))
});

gulp.task('sources-minify', function() {
	gulp.src('./'+require('./package.json').name+'.js')
	.pipe(uglify())
	.pipe(rename(require('./package.json').name+'.min.js'))
	.pipe(gulp.dest('./'))
});

gulp.task('sources-watch', function() {
	gulp.watch(['./sources/**/index.js'], ['sources-compile', 'sources-minify']);
});

gulp.task('default', ['sources-compile', 'sources-minify', 'sources-watch']);

process.stdin.on("data", process.exit);
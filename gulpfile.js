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
	.pipe(rename('oswst.js'))
	.pipe(gulp.dest('./'))
});

gulp.task('sources-watch', function() {
	gulp.watch(['./sources/**/index.js'], ['sources-compile']);
});

gulp.task('default', ['sources-compile', 'sources-watch']);

process.stdin.on("data", process.exit);
var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemap = require('gulp-concat-sourcemap');
var uglify = require('gulp-uglifyjs');
var mocha = require('gulp-mocha');
var plumber = require('gulp-plumber');

gulp.task('default', ['templates']);

gulp.task('templates', ['templates-concat', 'templates-minify', 'templates-watch']);

gulp.task('templates-concat', function() {
	gulp.src([
		'sources/open.js',
		
		'sources/compiler/index.js',
		
		'sources/helpers.js',
		
		'sources/render/index.js',
		
		'sources/sync/index.js',
		'sources/async/index.js',
		
		'sources/prototype/index.js',
		'sources/data/index.js',
		'sources/tag/index.js',
		'sources/single/index.js',
		'sources/singles/index.js',
		'sources/double/index.js',
		'sources/doubles/index.js',
		'sources/doctype/index.js',
		'sources/doctypes/index.js',
		'sources/xml/index.js',
		
		'sources/mixin/index.js',
		'sources/mixins/index.js',
		
		'sources/with/index.js',
		
		'sources/close.js'
	])
	.pipe(plumber())
	.pipe(sourcemap('templates.js'))
	.pipe(gulp.dest('./'));
});

gulp.task('templates-minify', function() {
	gulp.src('templates.js')
	.pipe(plumber())
	.pipe(concat('templates.min.js'))
	.pipe(uglify({ outSourceMap: true, inSourceMap: 'templates.js.map' }))
	.pipe(gulp.dest('./'));
});

gulp.task('templates-watch', function() {
	gulp.watch(['sources/*', 'sources/**/*'], ['templates-concat', 'templates-minify']);
});

process.stdin.on("data", process.exit);
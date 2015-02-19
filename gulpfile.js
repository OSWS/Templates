var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemap = require('gulp-concat-sourcemap');
var uglify = require('gulp-uglifyjs');
var mocha = require('gulp-mocha');
var plumber = require('gulp-plumber');
var debug = require('gulp-debug');

gulp.task('default', ['templates']);

gulp.task('templates', ['concat', 'minify', 'watch']);

gulp.task('concat', function() {
	gulp.src([
		'sources/open.js',
		
		'sources/compiler/index.js',
		
		'sources/helpers.js',
		
		'sources/render/index.js',
		
		'sources/sync/index.js',
		'sources/async/index.js',
		
		'sources/prototype/index.js',
		'sources/renderer/index.js',
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
		
		'sources/module/index.js',
		
		'sources/with/index.js',
		
		'sources/close.js'
	])
	.pipe(debug({ title: 'concat:' }))
	.pipe(plumber())
	.pipe(sourcemap('oswst.js'))
	.pipe(gulp.dest('./'));
});

gulp.task('minify', function() {
	gulp.src('oswst.js')
	.pipe(debug({ title: 'minify:' }))
	.pipe(plumber())
	.pipe(concat('oswst.min.js'))
	.pipe(uglify({ outSourceMap: true, inSourceMap: 'oswst.js.map' }))
	.pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
	gulp.watch(['sources/*', 'sources/**/*'], ['concat', 'minify']);
});

process.stdin.on("data", process.exit);
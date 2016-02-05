/* jshint node:true */
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
  return $.rubySass('lib/conekta-button.scss', {sourcemap: true})
    .pipe($.autoprefixer("last 1 version"))
    .pipe($.sourcemaps.write('.', {
        includeContent: false,
        sourceRoot: '../lib'
    }))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('coffee', function() {
  return gulp.src('lib/conekta-button.coffee')
    .pipe($.coffee({bare: true}).on('error', $.util.log))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('webserver', function() {
  gulp.src('.')
    .pipe($.webserver({
      livereload: false,
      directoryListing: false,
      open: true
    }));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('watch', function () {

  gulp.watch('lib/conekta-button.scss', ['styles']);

  gulp.watch('lib/conekta-button.coffee', ['coffee']);
});

gulp.task('setup', ['watch', 'webserver', 'styles', 'coffee']);

gulp.task('default', ['clean'], function () {
  gulp.start('setup');
});

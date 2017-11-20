/**
 * This script is originally based on-
 * https://markgoodyear.com/2014/01/getting-started-with-gulp/
 */

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    del = require('del');
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    livereload = require('gulp-livereload'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('scripts', function() {
  return gulp.src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/materialize-css/dist/js/materialize.min.js',
      'node_modules/underscore/underscore-min.js',
      'node_modules/backbone/backbone-min.js',
      //'src/scripts/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('styles', function() {
  return gulp.src(['src/styles/*.scss'])
    .pipe(sass({includePaths: 'node_modules/materialize-css/sass/'}).on('error', sass.logError))
    .pipe(autoprefixer('last 2 version'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('fonts', function () {
    return gulp.src(['node_modules/materialize-css/dist/fonts/**/*'])
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean', function() {
    return del(['dist/css', 'dist/js', 'dist/img', 'dist/fonts']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images', 'fonts');
});

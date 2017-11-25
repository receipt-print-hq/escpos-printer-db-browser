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
    uglify = require('gulp-uglify');

var HTML_SRC = 'index.html';
var IMG_SRC = 'src/images/**/*';
var SCRIPTS_SRC = 'src/scripts/*.js';
var STYLE_SRC = 'src/styles/*.scss';

gulp.task('images', function() {
  return gulp.src(IMG_SRC)
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/img'));
    .pipe(livereload());
});

gulp.task('scripts', function() {
  return gulp.src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/materialize-css/dist/js/materialize.min.js',
      'node_modules/underscore/underscore-min.js',
      'node_modules/backbone/backbone-min.js',
      SCRIPTS_SRC
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(livereload());
});

gulp.task('styles', function() {
  return gulp.src(STYLE_SRC)
    .pipe(sass({includePaths: 'node_modules/materialize-css/sass/'}).on('error', sass.logError))
    .pipe(autoprefixer('last 2 version'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'));
    .pipe(livereload());
});

gulp.task('fonts', function () {
    return gulp.src(['node_modules/materialize-css/dist/fonts/**/*'])
      .pipe(gulp.dest('dist/fonts'));
});

gulp.task('html', function () {
    return gulp.src(HTML_SRC)
      .pipe(livereload());
});

gulp.task('clean', function() {
    return del(['dist/css', 'dist/js', 'dist/img', 'dist/fonts']);
});

gulp.task('default:watch', ['default'], function() {
  livereload.listen();
  gulp.watch(HTML_SRC, ['html']);
  gulp.watch(IMG_SRC, ['images']);
  gulp.watch(SCRIPTS_SRC, ['scripts']);
  gulp.watch(STYLE_SRC, ['styles']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'html', 'scripts', 'images', 'fonts');
});

var gulp = require ('gulp'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    minify = require('gulp-minify-css'),
    rename    = require('gulp-rename'); 
    concat    = require('gulp-concat'),
    browserSync = require('browser-sync');
var reload = browserSync.reload;


 //Scripts Task
 // Uglifies
 gulp.task('scripts', function(){
   return gulp.src('app/pre-js/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
 });

// Static Server + watching scss/html files
//
gulp.task('serve', ['sass', 'scripts'], function() {

    browserSync.init({
        server: "./app"
    });

    gulp.watch("app/scss/*.scss", ['sass']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
    gulp.watch('app/pre-js/*.js', ['scripts']);
});

// Compile sass into CSS & auto-inject into browsers
//
gulp.task('sass', function() {
         gulp.src("app/scss/*.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(minify())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

gulp.task('minify-css', function() {
    return gulp.src('app/pre-css/*.css')
        .pipe(minify())
        .pipe(gulp.dest('app/css'));
});

//
// Default action: uglifies JS, minifies Bootstrap CSS, compiles SASS to CSS and minifies it,
// and, finally, tracks new changes to JS and SASS code so it can be compiled, minified, 
// and previewed once more if gulp detects any new changes.
//
gulp.task('default', ['scripts', 'minify-css', 'sass', 'serve']);
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    jsonminify = require('gulp-jsonminify'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    CSSMinify = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    HTMLMinify = require('gulp-minify-html'),
    imagemin = require('gulp-imagemin'),   
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create();
var reload = browserSync.reload;


//Scripts Task
// Uglifies
gulp.task('scripts', function () {
    return gulp.src('src/js/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest('build/js'));
});

gulp.task('json', function(){
    return gulp.src('src/js/*.json')
       .pipe(plumber())
        .pipe(jsonminify())
        .pipe(gulp.dest('build/js'));
});


// Compile sass into CSS & auto-inject into browsers
//
gulp.task('sass', function () {
    gulp.src("src/scss/main.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(CSSMinify())
        .pipe(gulp.dest("build/css"))
        .pipe(browserSync.stream());
});

gulp.task('autoprefixer', function() {
    gulp.src("build/css/main.css") 
        .pipe(autoprefixer({
              browsers: ['last 2 versions'],
              cascade: false
        })) 
        .pipe(gulp.dest("build/css"));
    
}); 

//
// Minify HTML
//
//
gulp.task('minify-html', function() { 
    var opts = {
       conditionals: true,
       spare: true 
    };

    return gulp.src('src/html/*.html')
        .pipe(HTMLMinify(opts))
        .pipe(gulp.dest('build/'));
});
// Compress pictures
//
gulp.task('imagemin', function()  {
    return gulp.src('src/pics/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/pics'));
});
//
// Static Server + watching scss/html files
//
gulp.task('serve', ['sass', 'minify-html', 'scripts', 'json'], function () {

    browserSync.init({
        server: './build'
    });

    gulp.watch("src/scss/**/*.scss", ['sass', 'autoprefixer']);
    gulp.watch("src/html/*.html", ['minify-html']);
    gulp.watch("build/*.html").on('change', browserSync.reload);
    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch('src/js/*.json', ['json']);
});
//
// Default action: uglifies JS, minifies Bootstrap CSS, compiles SASS to CSS and minifies it,
// and, finally, tracks new changes to JS and SASS code so it can be compiled, minified, 
// and previewed once more if gulp detects any new changes.
//
gulp.task('default', ['imagemin', 'scripts', 'json', 'sass', 'autoprefixer', 'serve']);

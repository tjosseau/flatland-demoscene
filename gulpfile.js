
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');

var error = function(error) {
    console.log('error:') ;
    console.log(error) ;
} ;

gulp.task('app-js', function() {
    gulp.src([
        'app/component/*.js',
        'app/ui/*.js',
        'app/view/*.js'
    ])
        .pipe(sourcemaps.init({loadMaps: true})).on('error', error)
            .pipe(concat('app.min.js')).on('error', error)
            .pipe(uglify()).on('error', error)
        .pipe(sourcemaps.write('./')).on('error', error)
        .pipe(gulp.dest('build')).on('error', error) ;
});

gulp.task('vendors-js', function() {
    gulp.src([
        // Frameworks
        'app/fwk/Objectyve.js',
        'app/fwk/three.js',
        // Libraries
        'app/lib/domes.js',
        'app/lib/domes-ext.js',
        'app/lib/threejs/**/*.js',
        'app/lib/TweenLite.min.js',
        'app/lib/soundjs-0.5.2.min.js'
    ])
        .pipe(sourcemaps.init({loadMaps: true})).on('error', error)
            .pipe(concat('vendors.min.js')).on('error', error)
            .pipe(uglify()).on('error', error)
        .pipe(sourcemaps.write('./')).on('error', error)
        .pipe(gulp.dest('build')).on('error', error) ;
});

gulp.task('watch', function() {
    watch('app/**/*.js', function() {
        gulp.start('app-js') ;
        // gulp.start('vendors-js') ;
    }) ;
}) ;

gulp.task('default', ['app-js', 'vendors-js', 'watch'], function() {});

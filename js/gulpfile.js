var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var jsFileList = [
    // './node_modules/aftc.js/src/base.js',
    // './node_modules/aftc.js/src/io.js',
    './src/aftc.preload.js',
    './src/aftc.preload.xhr.js',
    './src/aftc.preload.public.js',
    './src/aftc.preload.batch.js',
    './src/aftc.preload.img.js',
    './src/aftc.preload.css.js',
    './src/aftc.preload.js.js',
    './src/aftc.preload.on.js',
    './src/aftc.preload.font.js'
];

gulp.task('build', ['build-dev', 'build-dist']);

gulp.task('build-dist', function () {
    gulp.src(jsFileList)
        .pipe(concat('aftc.preload.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build-dev', function () {
    gulp.src(jsFileList)
        .pipe(concat('aftc.preload.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function () {
    gulp.watch(jsFileList, ['build']);
});
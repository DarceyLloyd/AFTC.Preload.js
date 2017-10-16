var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var jsFileList = [
    //'./node_modules/jquery/dist/jquery.min.js',
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

gulp.task('build', function () {
    gulp.src(jsFileList)
        .pipe(concat('aftc.preload.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function () {
    gulp.watch(jsFileList, ['build']);
});
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var jsFileList = [
    './node_modules/jquery/dist/jquery.min.js',
    './src/aftc.preload.js'
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
const gulp = require("gulp");

const concat = require('gulp-concat');
const terser = require('gulp-terser');


// - - - - - - - - - - - - - - - - - - - - - - - - - -
// JS Libs / Vendor
// - - - - - - - - - - - - - - - - - - - - - - - - - -

const distDir = "./dist/";

let jsFiles = [
    // "./node_modules/aftc.js/dist/aftc.core.min.js",
    "./src/aftc.preloader.js",
    
];
// - - - - - - - - - - - - - - - - - - - - - - - - - -



let buildJSDev = function (done) {
    gulp.src(jsFiles)
        .pipe(concat('aftc.preload.js'))
        .on("error", function (e) {
            console.log(e.toString());
            this.emit("end");
        })
        .pipe(gulp.dest(distDir))
    done();
};
// - - - - - - - - - - - - - - - - - - - - - - - - - -

let buildJSProd = function (done) {
    gulp.src(jsFiles)
        .pipe(concat('aftc.preload.min.js'))
        .pipe(terser())
        // .pipe(inject.prepend(msg))
        .on("error", function (e) {
            console.log(e.toString());
            this.emit("end");
        })
        .pipe(gulp.dest(distDir));
    done();
};
// - - - - - - - - - - - - - - - - - - - - - - - - - -

gulp.task("build", gulp.parallel(
    buildJSDev, buildJSProd
));
// - - - - - - - - - - - - - - - - - - - - - - - - - -





gulp.task("watch", function(){
    gulp.watch([
        "./src/*.js"
    ], gulp.parallel(buildJSDev, buildJSProd));
});
// - - - - - - - - - - - - - - - - - - - - - - - - - -




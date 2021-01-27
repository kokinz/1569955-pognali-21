const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");

const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const autoprefixer = require("autoprefixer");
const htmlmin = require("gulp-htmlmin");
const csso = require("postcss-csso");
const imagemin = require("gulp-imagemin");
const del = require("del");


const sync = require("browser-sync").create();

const clean = () => {
  return del("build");
};

const  html = () => {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("build"))
}

exports.html = html;

const scripts =  () => {
  return gulp.src("source/js/main.js")
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest("build/js"))
}

exports.scripts = scripts;

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"))
}

exports.images = images;

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(gulp.dest("build/css"))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/img/**/*.{jpg,png,svg}",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;


const build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    scripts,
    copy,
    images,
  ));

exports.build = build;



// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series("html")).on("change", sync.reload);
}

exports.default = gulp.series(
  clean, html, scripts, styles, copy, server, watcher
);

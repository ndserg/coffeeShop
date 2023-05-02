const gulp = require("gulp");
const del = require("del");
const mode = require('gulp-mode')();
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const csso = require("postcss-csso");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass")(require("sass"))
const autoprefixer = require("autoprefixer");
const imagemin = require("gulp-imagemin");
const svgstore = require("gulp-svgstore");
const webp = require("gulp-webp");
const htmlmin = require("gulp-htmlmin");
const inject = require("gulp-inject");
const rename = require("gulp-rename");
const {dest, series, parallel, src} = require("gulp");
const sync = require("browser-sync").create();

// clean
const clean = () => {
  return del("build");
}

exports.clean = clean;

//Copy

const copy = () => {
  return src([
    "source/fonts/**/*.{woff2,woff}",
    "source/icons/**/*",
    "source/*.{png,ico,webmanifest}",
    ], {
    base: "source"
    })
    .pipe(dest("build"))
}

exports.copy = copy;

// Images

const images = () => {
  return src("source/img/**/*.{jpg,png,svg}")
  .pipe(imagemin([
    imagemin.mozjpeg({quality: 75, progressive: true}),
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.svgo({
      plugins: [{
        removeViewBox: false,
      }],
    }),
  ]))
  .pipe(dest("build/img"))
}

exports.images = images;

// Wepp

const createWebp = () => {
  return src("source/img/**/*.jpg")
  .pipe(webp({quality: 80}))
  .pipe(dest("build/img/"))
}

exports.createWebp = createWebp;

// Icons

const icons = () => {
  return src("source/icons/*.svg")
  .pipe(mode.production(imagemin([
    imagemin.svgo({
      plugins: [{
        removeViewBox: false,
      }],
    }),
  ])))
  .pipe(svgstore())
  .pipe(rename("sprite.svg"))
  .pipe(dest("build/icons/"))
}

exports.icons = icons;

// Styles

const styles = () => {
  return src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(mode.development(sourcemap.init()))
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(mode.development(sourcemap.write("sourcemaps")))
    .pipe(dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

//js

const scripts = () => {
  return src("source/js/*.js")
    .pipe(mode.development(sourcemap.init()))
    .pipe(babel({
      presets: ["@babel/env"]
    }))
    .pipe(mode.production(uglify()))
    .pipe(concat("main.min.js"))
    .pipe(mode.development(sourcemap.write("sourcemaps")))
    .pipe(dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// HTML

const html = () => {
  return src("source/*.html")
  .pipe(inject(src(["build/js/*.js", "build/css/*.css"], {read: false}) , {ignorePath: "build", addRootSlash: false}))
  .pipe(mode.production(htmlmin({collapseWhitespace: true})))
  .pipe(dest("build"))
  .pipe(sync.stream());
}

exports.html = html;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", series(styles));
  gulp.watch("source/*.html", series(html));
  gulp.watch("source/js/*.js", series(scripts, reload));
}

exports.build = series(
  clean,
  parallel(copy, styles, scripts, images, createWebp, icons),
  html
);

exports.default = series(
  clean,
  parallel(copy, styles, scripts, images, createWebp, icons),
  html,
  server,
  watcher
);

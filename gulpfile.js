const { src, series, parallel, dest, watch } = require("gulp");
const gulpSass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const del = require("del");
const jest = require("gulp-jest").default;

const tests = () => {
  return src("__tests__").pipe(
    jest({
      preprocessorIgnorePatterns: [
        "<rootDir>/dist/",
        "<rootDir>/node_modules/",
      ],
      automock: false,
    })
  );
};

const cleanTask = () => {
  return del("dist");
};

const sassTask = () => {
  return src("src/index.scss", { sourcemaps: true })
    .pipe(gulpSass())
    .pipe(dest("dist", { sourcemaps: "." }))
    .pipe(browserSync.stream());
};

const serveTask = (cb) => {
  browserSync.init({
    server: {
      baseDir: ".",
    },
    notify: false,
  });

  cb();
};

const reloadServerTask = (cb) => {
  browserSync.reload();

  cb();
};

const watchTask = () => {
  watch("index.html", reloadServerTask);
  watch("src/**/*.scss", series(tests, sassTask, reloadServerTask));
  watch("__tests__/**/*.scss", tests);
};

exports.default = series(cleanTask, sassTask, serveTask, watchTask);

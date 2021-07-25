const { src, series, parallel, dest, watch } = require("gulp");
const gulpSass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const del = require("del");

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
  watch("src/**/*.scss", series(sassTask, reloadServerTask));
};

exports.default = series(cleanTask, sassTask, serveTask, watchTask);

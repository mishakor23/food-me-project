// *** dependencies *** //

const path = require('path');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const runSequence = require('run-sequence');
const nodemon = require('gulp-nodemon');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const server = require('tiny-lr')();
const sass = require('gulp-sass');

// *** config *** //

const paths = {
  scripts: [
    path.join('src', '**', '*.js'),
    path.join('src', '*.js')
  ],
  css: [
    path.join('src', 'client', 'css', '*.css')
  ],
  scss: [
    path.join('src', 'client', 'scss', '*.scss')
  ],
  views: [
    path.join('src', 'server', '**', '*.njk'),
    path.join('src', 'server', '*.njk')
  ],
  server: path.join('src', 'server', 'server.js')
};

const lrPort = 35729;

const nodemonConfig = {
  script: paths.server,
  ext: 'html njk js css scss',
  ignore: ['node_modules'],
  env: {
    NODE_ENV: 'development'
  }
};

// *** default task *** //

gulp.task('default', () => {
  runSequence(
    ['lint'],
    ['lr'],
    ['nodemon'],
    ['scss'],
    ['watch']
  );
});

// *** sub tasks ** //

gulp.task('scss', () => {
  return gulp.src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(path.join('src', 'client', 'css')));
});

gulp.task('lint', () => {
  return gulp.src(paths.scripts)
    .pipe(eslint())
    .pipe(eslint.format('stylish'))
    .pipe(eslint.failAfterError());
});

gulp.task('styles', () => {
  return gulp.src(paths.css)
    .pipe(plumber());
});

gulp.task('views', () => {
  return gulp.src(paths.views)
    .pipe(plumber());
});

gulp.task('lr', () => {
  server.listen(lrPort, (err) => {
    if (err) {
      return console.error(err);
    }
  });
});

gulp.task('nodemon', () => {
  return nodemon(nodemonConfig);
});

gulp.task('watch', () => {
  gulp.watch(paths.views, ['views']);
  gulp.watch(paths.scss, ['scss']);
  gulp.watch(paths.scripts, ['lint']);
  gulp.watch(paths.css, ['styles']);
});

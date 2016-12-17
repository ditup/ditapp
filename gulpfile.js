'use strict';

const gulp = require('gulp');
const protractor = require("gulp-protractor").protractor;

gulp.task('e2e', function () {
  // Watch end-to-end tests
  gulp.watch(['./src/app/**/*.ts', './e2e/**/*.ts', './src/app/**/*.html', './src/app/**/*.css'], function () {
    gulp.src(["./e2e/*.ts"])
      .pipe(protractor({
        configFile: "./protractor.conf.js",
        args: ['--baseUrl', 'http://localhost:4200']
      }))
      .on('error', function(e) {
        console.error(e);
      });
  });
});

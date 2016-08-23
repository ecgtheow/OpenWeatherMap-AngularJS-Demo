'use strict';

var gulp = require ('gulp');
var config = require ('../gulpconfig');

var $ = require ('gulp-load-plugins') ({
  pattern: config.glpPattern
});

gulp.task ('clean:dist', function (done) {
  return $.del ([
    config.destDirs.dist
  ], done);
});

gulp.task ('clean:build', function (done) {
  return $.del ([
    config.destDirs.build
  ], done);
});

gulp.task ('clean:docs', function (done) {
  return $.del ([
    config.destDirs.docs
  ], done);
});

gulp.task ('clean', gulp.parallel ('clean:dist',
                                   'clean:build',
                                   'clean:docs'));

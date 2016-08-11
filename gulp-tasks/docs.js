'use strict';

var gulp = require ('gulp');
var config = require ('../gulpconfig');

var $ = require ('gulp-load-plugins') ({
  pattern: config.glpPattern
});

gulp.task ('docs', function (done) {
  return gulp.src (config.appFiles.appJS)
    .pipe ($.ngdocs.process ({
      title: 'OpenWeatherMapApp Documentation',
      html5Mode: false
    }))
    .pipe (gulp.dest (config.destDirs.docs));
});

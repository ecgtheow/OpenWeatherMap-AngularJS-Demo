'use strict';

var path = require ('path');

var gulp = require ('gulp');
var config = require ('../gulpconfig');

var _ = require ('lodash');

var $ = require ('gulp-load-plugins') ({
  pattern: config.glpPattern
});

gulp.task ('jshint:app', function () {
  return gulp.src (_.flatten ([config.appFiles.appJS]))
    .pipe ($.jshint.extract ('auto'))
    .pipe ($.jshint (path.join (config.rootDir, '.jshintrc')))
    .pipe ($.jshint.reporter ('jshint-stylish'))
    .pipe ($.jshint.reporter ('fail'))
    .pipe ($.size ({
      title: 'App files: '
    }));
});

gulp.task ('jscs:app', function () {
  return gulp.src (_.flatten ([config.appFiles.appJS]))
    .pipe ($.jscs ())
    .pipe ($.jscs.reporter ())
    .pipe ($.jscs.reporter ('fail'));
});

gulp.task ('sass-lint:app', function () {
  return gulp.src (config.appFiles.appSCSS)
    .pipe ($.sassLint ({
      rules: {
        /* Need to turn these off as the bootstrap-sass files don't
         * comply with sass-lint's default opinions
         */
        'clean-import-paths': 0,
        'variable-name-format': 0,
        /* Need to turn these off for the standard ng-cloak definition */
        'force-element-nesting': 0,
        'no-important': 0
      }
    }))
    .pipe ($.sassLint.format ())
    .pipe ($.sassLint.failOnError ());
});

gulp.task ('jshint:app:test', function () {
  return gulp.src (config.appFiles.appTestJS)
    .pipe ($.jshint.extract ('auto'))
    .pipe ($.jshint (path.join (config.srcDirs.appTest, '.jshintrc')))
    .pipe ($.jshint.reporter ('jshint-stylish'))
    .pipe ($.jshint.reporter ('fail'))
    .pipe ($.size ({
      title: 'App test files: '
    }));
});

gulp.task ('jscs:app:test', function () {
  return gulp.src (config.appFiles.appTestJS)
    .pipe ($.jscs ())
    .pipe ($.jscs.reporter ())
    .pipe ($.jscs.reporter ('fail'));
});

gulp.task ('jshint:app:e2e', function () {
  return gulp.src (config.appFiles.appE2EJS)
    .pipe ($.jshint.extract ('auto'))
    .pipe ($.jshint (path.join (config.srcDirs.appTest, '.jshintrc')))
    .pipe ($.jshint.reporter ('jshint-stylish'))
    .pipe ($.jshint.reporter ('fail'))
    .pipe ($.size ({
      title: 'App e2e test files: '
    }));
});

gulp.task ('jscs:app:e2e', function () {
  return gulp.src (config.appFiles.appE2EJS)
    .pipe ($.jscs ())
    .pipe ($.jscs.reporter ())
    .pipe ($.jscs.reporter ('fail'));
});

gulp.task ('jshint:gulp', function () {
  return gulp.src (_.flatten ([config.appFiles.gulpJS]))
    .pipe ($.jshint (path.join (config.rootDir, '.jshintrc')))
    .pipe ($.jshint.reporter ('jshint-stylish'))
    .pipe ($.jshint.reporter ('fail'))
    .pipe ($.size ({
      title: 'Gulp files: '
    }));
});

gulp.task ('jscs:gulp', function () {
  return gulp.src (_.flatten ([config.appFiles.gulpJS]))
    .pipe ($.jscs ())
    .pipe ($.jscs.reporter ())
    .pipe ($.jscs.reporter ('fail'));
});

gulp.task ('jshint', gulp.parallel ('jshint:app',
                                    'jshint:app:test',
                                    'jshint:app:e2e',
                                    'jshint:gulp'));

gulp.task ('jscs', gulp.parallel ('jscs:app',
                                  'jscs:app:test',
                                  'jscs:app:e2e',
                                  'jscs:gulp'));

gulp.task ('lint', gulp.parallel ('jshint',
                                  'jscs'));

gulp.task ('lint:app', gulp.parallel ('jshint:app',
                                      'jscs:app'));

gulp.task ('lint:app:styles', gulp.parallel ('sass-lint:app'));

gulp.task ('lint:app:test', gulp.parallel ('jshint:app:test',
                                           'jscs:app:test'));

gulp.task ('lint:app:e2e', gulp.parallel ('jshint:app:e2e',
                                          'jscs:app:e2e'));

gulp.task ('lint:gulp', gulp.parallel ('jshint:gulp',
                                       'jscs:gulp'));

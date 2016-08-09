'use strict';

var fse = require ('fs-extra');
var path = require ('path');

var gulp = require ('gulp');
var config = require ('../gulpconfig');

var istanbul = require ('istanbul');
var remapIstanbul = require ('remap-istanbul/lib/gulpRemapIstanbul');

var $ = require ('gulp-load-plugins') ({
  pattern: config.glpPattern
});

function remapCoverage (coverageFile) {
  var inFile = path.join (config.rootDir, 'coverage', coverageFile);
  var outDir = path.join (config.rootDir, 'coverage');

  return gulp
    .src (inFile)
    .pipe (remapIstanbul ({
      exclude: /\/node_modules\/|\/app\/assets/
    }))
    .pipe ($.rename ('coverage-remapped.json'))
    .pipe (gulp.dest (outDir));
}

function reportCoverage (done) {
  var inFile = path.join (config.rootDir, 'coverage', 'coverage-remapped.json');
  var outDir = 'coverage';

  var collector = new istanbul.Collector ();
  var reporter = new istanbul.Reporter ({
    reporting: {
      reportConfig: function () {
        return {
          cobertura: {
            file: 'cobertura.xml'
          }
        };
      },
      watermarks: function () {
        return istanbul.config.defaultConfig ().reporting.watermarks;
      }
    }
  }, outDir);

  fse.readFile (inFile, function (err, data) {
    if (err) {
      return done (err);
    }

    collector.add (JSON.parse (data));

    reporter.addAll (['html', 'cobertura']);
    reporter.write (collector, false, done);
  });
}

module.exports = {
  remapCoverage: remapCoverage,
  reportCoverage: reportCoverage
};

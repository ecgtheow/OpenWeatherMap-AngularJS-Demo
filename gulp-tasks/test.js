'use strict';

var path = require ('path');

var gulp = require ('gulp');
var config = require ('../gulpconfig');

var Karma = require ('karma').Server;
/*
var $ = require ('gulp-load-plugins') ({
  pattern: config.glpPattern
});
*/

var utils = require ('./utils');

function testApp (done) {
  var configFile = path.join (config.srcDirs.appTest, 'karma.conf.js');

  new Karma ({
    configFile: configFile,
    singleRun: true
  }, function (err) {
    /* Remove the karma config file from the require cache, so any
     * changes will be picked up next time
     */
    delete require.cache[require.resolve (configFile)];

    done (err);
  }).start ();
}

gulp.task ('test:app', gulp.series ('compile:app:devel',
                                    testApp,
                                    function testAppRemapCoverage () {
                                      return utils.remapCoverage ('coverage-compiled.json');
                                    },
                                    function testAppReportCoverage (done) {
                                      utils.reportCoverage (done);
                                    }));

gulp.task ('test', gulp.series ('compile:app:devel:ieshims',
                                'compile:app:devel:vendor',
                                'test:app'));

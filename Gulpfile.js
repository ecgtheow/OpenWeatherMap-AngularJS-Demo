'use strict';

var gulp = require ('gulp');
var FwdRef = require ('undertaker-forward-reference');

gulp.registry (new FwdRef ());

require ('./gulp-tasks');

gulp.task ('default', gulp.series ('check-datasources',
                                   'jshint:app',
                                   'jscs:app',
                                   'docs',
                                   'build:dev',
                                   'build:prod',
                                   'test'));

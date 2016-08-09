module.exports = function(config) {
  'use strict';

  config.set({
    autoWatch: false,
    basePath: '../../',
    frameworks: ['jasmine-jquery', 'jasmine', 'browserify'],
    files: [
      'app/test/phantomjs-polyfill/Number.isNaN.js',
      'build/scripts/vendor.js',
      'build/scripts/app.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'app/test/mock/**/*.js',
      'app/test/spec/**/*.js'
    ],
    exclude: [],
    reporters: ['mocha', 'coverage'/*, 'threshold'*/],
    preprocessors: {
      'app/test/mock/**/*.js': ['browserify'],
      'app/test/spec/**/*.js': ['browserify'],
      '**/*.js': ['sourcemap'],
      'build/scripts/app.js': ['coverage'],
      'app/src/scripts/{,**/}*.js': ['coverage']
    },
    mochaReporter: {
      output: 'full',
      ignoreSkipped: true
    },
    coverageReporter: {
      dir: 'coverage',
      reporters: [{
        type: 'json',
        subdir: '.',
        file: 'coverage-compiled.json'
      }]
    },
    browserify: {
      debug: true
    },

    /* Unfortunately istanbul doesn't understand the embedded
     * sourcemaps, so we just get the bundled file in the coverage
     * report.  This gets post-processed by the gulp task.
     *
     * See https://github.com/gotwarlost/istanbul/issues/212
     */
    // thresholdReporter: {
    //   lines: 100,
    //   statements: 100,
    //   branches: 100,
    //   functions: 100
    // },
    port: 8080,
    browsers: [
      'PhantomJS'
    ],
    singleRun: true,
    colors: true,
    logLevel: config.LOG_INFO,
  });
};

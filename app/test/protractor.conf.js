'use strict';

var fse = require ('fs-extra');

exports.config = {
  specs: [
    'e2e/**/*.js'
  ],

  /* Browser configuration is supplied by gulp */

  framework: 'jasmine2',

  seleniumAddress: 'http://localhost:4444/wd/hub',

  jasmineNodeOpts: {
    /* Hide the default dot reporter */
    print: function () {}
  },

  plugins: [/*{
    /* Use this to display all client-side console messages generated
     * by each test
     */
   /*
    package: 'protractor-console',
    logLevels: ['debug', 'info', 'warning', 'severe']
  }*/],

  onPrepare: function () {
    var path = require ('path');

    require ('jasmine2-custom-message');
    require ('./e2e-helpers/waitReady');

    var SpecReporter = require ('jasmine-spec-reporter');
    jasmine.getEnv ().addReporter (new SpecReporter ({
      displayStackTrace: 'spec'
    }));

    var HtmlScreenshotReporter = require ('protractor-jasmine2-screenshot-reporter');
    var screenShotDest = path.join ('screenshots', browser.params.profileName);

    /* The screenshot reporter blows up if its destination directory
     * doesn't exist.  It also doesn't clear the directory if all tests pass.
     */
    fse.emptyDir (screenShotDest);

    jasmine.getEnv ().addReporter (new HtmlScreenshotReporter ({
      dest: screenShotDest,
      filename: 'report.html',
      preserveDirectory: false,
      ignoreSkippedSpecs: true,
      captureOnlyFailedSpecs: true,
      reportOnlyFailedSpecs: true
    }));

    /* Browser sizes are passed from gulp */
    if (browser.params && browser.params.size) {
      browser.driver.manage ().window ().setSize (browser.params.size.width,
                                                  browser.params.size.height);
    }

    /* Disable angular animations - see
     * http://stackoverflow.com/questions/26584451/how-to-disable-animations-in-protractor-for-angular-js-appliction
     */
    var disableNgAnimate = function () {
      angular.module ('disableNgAnimate', []).run (['$animate', function ($animate) {
        $animate.enabled (false);
      }]);
    };

    var disableCssAnimate = function () {
      angular.module ('disableCssAnimate', []).run (function () {
        var style = document.createElement ('style');
        style.type = 'text/css';
        style.innerHTML = '* {' +
          '-webkit-transition: none !important;' +
          '-moz-transition: none !important;' +
          '-o-transition: none !important;' +
          '-ms-transition: none !important;' +
          'transition: none !important;' +
          '}';
        document.getElementsByTagName ('head')[0].appendChild (style);
      });
    };

    browser.addMockModule ('disableNgAnimate', disableNgAnimate);
    browser.addMockModule ('disableCssAnimate', disableCssAnimate);
  },

  onComplete: function () {
  }
};

'use strict';

var AppPage = function () {
  var self = this;

  function getTarget (target) {
    return browser.get (target).then (function () {
      return browser.waitForAngular ();
    }).then (function () {
      /* Wait a bit harder for the page to be ready */
      return browser.wait (protractor.ExpectedConditions.presenceOf (element (by.id ('navbar'))), 1000);
    });
  }

  self.getHome = function () {
    return getTarget ('/');
  };
};

module.exports = new AppPage ();

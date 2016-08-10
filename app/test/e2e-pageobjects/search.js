'use strict';

var Search = function () {
  var self = this;

  self.cityInput = element (by.id ('city-input'));
  self.searchButton = element (by.id ('search-button'));
};

module.exports = new Search ();

'use strict';

var Navigation = function () {
  var self = this;

  self.navbar = element (by.id ('navbar'));
  self.settingsDropdown = element (by.id ('settings-dropdown'));
  self.settingsC = element (by.id ('settings-C'));
  self.settingsF = element (by.id ('settings-F'));
  self.settingsK = element (by.id ('settings-K'));
};

module.exports = new Navigation ();

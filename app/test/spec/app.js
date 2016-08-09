'use strict';

var angular = require ('angular');

describe ('Main app', function () {
  beforeEach (angular.mock.module ('openWeatherMapApp'));
  //beforeEach (angular.module ('openWeatherMapApp.Templates'));

  var $rootScope;

  inject (function (_$rootScope_) {
    $rootScope = _$rootScope_;
  });

  it ('should load without error', function () {
  });
});

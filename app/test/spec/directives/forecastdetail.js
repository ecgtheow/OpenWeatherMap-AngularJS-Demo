'use strict';

var angular = require ('angular');

describe ('Directive: forecastDetail', function () {
  beforeEach (angular.mock.module ('openWeatherMapApp'));
  beforeEach (angular.mock.module ('openWeatherMapApp.Templates'));

  var scope;

  beforeEach (angular.mock.module (function ($controllerProvider) {
    /* The controller is tested elsewhere */
    $controllerProvider.register ('ForecastDetailController', function () {
    });
  }));

  beforeEach (inject (function (_$rootScope_) {
    scope = _$rootScope_.$new ();
  }));

  it ('should compile if a forecast attribute is not specified', inject (function ($compile) {
    var element = angular.element ('<forecast-detail></forecast-detail>');

    expect (function () {
      element = $compile (element) (scope);
      scope.$digest ();
    }).not.toThrow ();
  }));

  it ('should compile if a forecast attribute is specified', inject (function ($compile) {
    var element = angular.element ('<forecast-detail forecast="forecast"></forecast-detail>');

    expect (function () {
      scope.forecast = {};
      element = $compile (element) (scope);
      scope.$digest ();
    }).not.toThrow ();
  }));
});

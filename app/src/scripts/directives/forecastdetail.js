'use strict';

var angular = require ('angular');

angular.module ('openWeatherMapApp')
  .directive ('forecastDetail', function () {
    return {
      scope: {
        forecast: '='
      },
      restrict: 'E',
      replace: true,
      templateUrl: '/views/forecastdetail.html',
      controller: 'ForecastDetailController',
      controllerAs: 'fdc',
      bindToController: true
    };
  });

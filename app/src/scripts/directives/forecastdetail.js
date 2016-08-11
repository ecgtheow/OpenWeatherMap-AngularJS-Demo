'use strict';

var angular = require ('angular');

/**
 * @ngdoc directive
 * @name openWeatherMapApp.directive:forecastDetail
 * @restrict E
 * @scope
 *
 * @description
 *  This displays a single forecast.
 *
 * @param {object} forecast A single element of the array property
 * `list` returned by the {@link
 * openWeatherMapApp.service:OpenWeatherMap OpenWeatherMap} service.
 */
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

'use strict';

var angular = require ('angular');

angular.module ('OpenWeatherMapMock', [])
  .service ('OpenWeatherMap', function ($q) {
    this.forecast5DayByName = function (name) {
      var deferred = $q.defer ();

      if (this.forecastData !== null) {
        deferred.resolve (this.forecastData);
      } else {
        deferred.reject ('Forced reject');
      }

      return deferred.promise;
    };

    this.forecast5DayById = function (id) {
      var deferred = $q.defer ();

      if (this.forecastData !== null) {
        deferred.resolve (this.forecastData);
      } else {
        deferred.reject ('Forced reject');
      }

      return deferred.promise;
    };

    this.setForecastData = function (data) {
      this.forecastData = data;
    };
  });

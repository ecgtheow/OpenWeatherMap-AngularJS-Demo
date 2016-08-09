'use strict';

var angular = require ('angular');

angular.module ('openWeatherMapApp')
  .controller ('ForecastDetailController', function (Settings) {
    var self = this;

    self.weatherIcon = function () {
      if (self.forecast &&
          self.forecast.weather &&
          self.forecast.weather[0]) {
        return 'http://openweathermap.org/img/w/' + self.forecast.weather[0].icon + '.png';
      } else {
        return '';
      }
    };

    self.weatherDescription = function () {
      if (self.forecast &&
          self.forecast.weather &&
          self.forecast.weather[0]) {
        return self.forecast.weather[0].description;
      } else {
        return '';
      }
    };

    self.temperature = function () {
      if (self.forecast &&
          self.forecast.main &&
          self.forecast.main.temp) {
        var K = self.forecast.main.temp;

        switch (Settings.getUnit ()) {
          case 'C':
            var C = Math.round ((K - 273.15) * 10) / 10;

            return C + '&#8451;';
          case 'F':
            var F = Math.round ((((K - 273.15) * 1.8) + 32) * 10) / 10;

            return F + '&#8457;';
          case 'K':
          /* falls through */
          default:
            return K + '&#176;K';
        }
      } else {
        return '';
      }
    };

    self.rain = function () {
      if (self.forecast &&
          self.forecast.rain &&
          self.forecast.rain['3h']) {
        return 'Rain: ' + self.forecast.rain['3h'] + 'mm';
      } else {
        return '';
      }
    };

    self.windSpeed = function () {
      if (self.forecast &&
          self.forecast.wind &&
          self.forecast.wind.speed) {
        return 'Wind speed: ' + self.forecast.wind.speed;
      } else {
        return '';
      }
    };

    self.windDirection = function () {
      if (self.forecast &&
          self.forecast.wind &&
          self.forecast.wind.deg) {
        return 'Wind direction: ' + self.forecast.wind.deg;
      } else {
        return '';
      }
    };
  });

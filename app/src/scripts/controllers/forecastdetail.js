'use strict';

var angular = require ('angular');

/**
 * @ngdoc controller
 * @name openWeatherMapApp.controller:ForecastDetailController
 *
 * @description
 *  This implements the API of the {@link
 *  openWeatherMapApp.directive:forecastDetail `<forecast-detail/>`}
 *  directive.
 */
angular.module ('openWeatherMapApp')
  .controller ('ForecastDetailController', function (Settings) {
    var self = this;

    /**
     * @ngdoc method
     * @name weatherIcon
     * @methodOf openWeatherMapApp.controller:ForecastDetailController
     *
     * @description
     *  Returns the URL of a weather icon to display.
     *
     * @returns {string} The URL of a weather icon to display, or an empty
     * string if not known.
     */
    self.weatherIcon = function () {
      if (self.forecast &&
          self.forecast.weather &&
          self.forecast.weather[0]) {
        return 'http://openweathermap.org/img/w/' + self.forecast.weather[0].icon + '.png';
      } else {
        return '';
      }
    };

    /**
     * @ngdoc method
     * @name weatherDescription
     * @methodOf openWeatherMapApp.controller:ForecastDetailController
     *
     * @description
     *  Returns a short summary of the weather forecast.
     *
     * @returns {string} The summary of a weather forecast, or an empty
     * string if not known.
     */
    self.weatherDescription = function () {
      if (self.forecast &&
          self.forecast.weather &&
          self.forecast.weather[0]) {
        return self.forecast.weather[0].description;
      } else {
        return '';
      }
    };

    /**
     * @ngdoc method
     * @name temperature
     * @methodOf openWeatherMapApp.controller:ForecastDetailController
     *
     * @description
     *  Returns a temperature, in the units specified by the {@link
     *  openWeatherMapApp.service:Settings Settings} service.
     *
     * @returns {string} The temperature forecast, or an empty string
     * if not known.
     */
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

    /**
     * @ngdoc method
     * @name rain
     * @methodOf openWeatherMapApp.controller:ForecastDetailController
     *
     * @description
     *  Returns the amount of rain expected by a weather forecast.
     *
     * @returns {string} The amount of rain forecast, or an empty
     * string if not known.
     */
    self.rain = function () {
      if (self.forecast &&
          self.forecast.rain &&
          self.forecast.rain['3h']) {
        return 'Rain: ' + self.forecast.rain['3h'] + 'mm';
      } else {
        return '';
      }
    };

    /**
     * @ngdoc method
     * @name windSpeed
     * @methodOf openWeatherMapApp.controller:ForecastDetailController
     *
     * @description
     *  Returns the wind speed expected by a weather forecast.
     *
     * @returns {string} The wind speed forecast, or an empty string
     * if not known.
     */
    self.windSpeed = function () {
      if (self.forecast &&
          self.forecast.wind &&
          self.forecast.wind.speed) {
        return 'Wind speed: ' + self.forecast.wind.speed;
      } else {
        return '';
      }
    };

    /**
     * @ngdoc method
     * @name windDirection
     * @methodOf openWeatherMapApp.controller:ForecastDetailController
     *
     * @description
     *  Returns the direction of wind expected by a weather forecast.
     *
     * @returns {string} The direction of wind forecast, or an empty
     * string if not known.
     */
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

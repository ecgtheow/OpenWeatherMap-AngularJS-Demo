'use strict';

var angular = require ('angular');
var moment = require ('moment');
var _ = require ('lodash');

/**
 * @ngdoc controller
 * @name openWeatherMapApp.controller:ForecastListController
 * @requires openWeatherMapApp.service:CityList
 * @requires openWeatherMapApp.service:OpenWeatherMap
 * @requires openWeatherMapApp.service:Settings
 *
 * @description
 *  This is the main controller of the `openWeatherMapApp` UI.
 */
angular.module ('openWeatherMapApp')
  .controller ('ForecastListController', function ($scope, CityList, OpenWeatherMap, Settings) {
    var self = this;

    /**
     * @ngdoc property
     * @name searchItem
     * @propertyOf openWeatherMapApp.controller:ForecastListController
     *
     * @returns {string} The city to search for forecasts.
     */
    self.searchItem = '';

    /**
     * @ngdoc property
     * @name cityNames
     * @propertyOf openWeatherMapApp.controller:ForecastListController
     *
     * @returns {array} A list of known city names
     */
    self.cityNames = CityList.cityNames;

    /**
     * @ngdoc property
     * @name retrieved
     * @propertyOf openWeatherMapApp.controller:ForecastListController
     *
     * @returns {array} A list of forecasts that have been returned by
     * the {@link openWeatherMapApp.service:OpenWeatherMap
     * OpenWeatherMap} service.
     */
    self.retrieved = [];

    /**
     * @ngdoc property
     * @name displayTimes
     * @propertyOf openWeatherMapApp.controller:ForecastListController
     *
     * @returns {array} A list of the times to use to display
     * forecasts.
     */
    self.displayTimes = [];

    /* Find the starting timestamp.  It has to be the first round 6
     * hours that is later than the current time.
     */
    var timestampStart = moment.utc ().startOf ('day');
    var now = moment.utc ();

    while (moment.utc (timestampStart).isBefore (now)) {
      timestampStart.add (6, 'hours');
    }

    for (var i = 0; i < 4; i++) {
      self.displayTimes.push (+timestampStart);
      timestampStart.add (6, 'hours');
    }

    /* Set up a timeout to update the displayTimes array */
    self.advanceTimesTimer = function () {
      var first = self.displayTimes[0] || moment.utc ();
      var newest = self.displayTimes[3] || moment.utc ();
      var delay = moment (first).diff (moment.utc ());

      setTimeout (function () {
        /* Remove the oldest time */
        self.displayTimes.splice (0, 1);
        /* Add another timestamp on the end */
        self.displayTimes.push (moment.utc (newest).add (6, 'hours').valueOf ());

        /* Make sure the change is noticed */
        $scope.$apply ();

        self.advanceTimesTimer.bind (self) ();
      }, delay);
    };

    self.advanceTimesTimer ();

    /**
     * @ngdoc method
     * @name unit
     * @methodOf openWeatherMapApp.controller:ForecastListController
     *
     * @description
     *  The currently selected temperature unit
     *
     * @returns {string} The selected temperature unit as returned by
     * {@link openWeatherMapApp.service:Settings#getUnit
     * Settings.getUnit ()}
     */
    self.unit = function () {
      return Settings.getUnit ();
    };

    /**
     * @ngdoc method
     * @name setUnit
     * @methodOf openWeatherMapApp.controller:ForecastListController
     *
     * @description
     *  Sets the temperature unit to use
     *
     * @param {string} unit The selected temperature unit to pass to
     * {@link openWeatherMapApp.service:Settings#setUnit
     * Settings.setUnit ()}
     */
    self.setUnit = function (unit) {
      Settings.setUnit (unit);
    };

    /**
     * @ngdoc method
     * @name displayTime
     * @methodOf openWeatherMapApp.controller:ForecastListController
     *
     * @description
     *  Formats a timestamp for display
     *
     * @param {number} timestamp The timestamp to format
     *
     * @returns {string} The formatted time to display
     */
    self.displayTime = function (timestamp) {
      return moment (timestamp).format ('h a');
    };

    /**
     * @ngdoc method
     * @name getForecast
     * @methodOf openWeatherMapApp.controller:ForecastListController
     *
     * @description
     *  Calls the {@link openWeatherMapApp.service:OpenWeatherMap
     *  OpenWeatherMap} service to retrieve a forecast, looking up the
     *  city named in the {@link
     *  openWeatherMapApp.controller:ForecastListController#searchItem
     *  searchItem} property.  The result is pushed onto the {@link
     *  openWeatherMapApp.controller:ForecastListController#retrieved
     *  retrieved} property.
     */
    self.getForecast = function () {
      var cityId = CityList.getCityIDByName (self.searchItem);
      var forecast;

      if (cityId !== -1) {
        forecast = OpenWeatherMap.forecast5DayById (cityId);
      } else {
        forecast = OpenWeatherMap.forecast5DayByName (self.searchItem);
      }

      forecast.then (function (response) {
        self.retrieved.push (response);
      }).catch (function (err) {
        console.log ('forecast error: ', err);
      });
    };

    /**
     * @ngdoc method
     * @name forecastCity
     * @methodOf openWeatherMapApp.controller:ForecastListController
     *
     * @description
     *  Returns the name of a city that corresponds to a particular forecast.
     *
     * @param {object} forecast A forecast returned from the {@link
     * openWeatherMapApp.service:OpenWeatherMap OpenWeatherMap}
     * service.
     *
     * @returns {string} The name of a city, or an empty string if not known.
     */
    self.forecastCity = function (forecast) {
      if (forecast &&
          forecast.city &&
          forecast.city.name) {

        var ret = forecast.city.name;

        if (forecast.city.country) {
          ret += ', ' + forecast.city.country;
        }

        return ret;
      } else {
        return '';
      }
    };

    /**
     * @ngdoc method
     * @name forecastDetail
     * @methodOf openWeatherMapApp.controller:ForecastListController
     *
     * @description
     *  Returns a single element of the array property `list` returned
     *  by the {@link openWeatherMapApp.service:OpenWeatherMap
     *  OpenWeatherMap} service.
     *
     * @param {object} forecast A forecast returned from the {@link
     * openWeatherMapApp.service:OpenWeatherMap OpenWeatherMap}
     * service.
     *
     * @param {number} timestamp The timestamp to use to look up a forecast.
     *
     * @returns {object} The forecast item, or `undefined` if not known.
     */
    self.forecastDetail = function (forecast, timestamp) {
      if (forecast) {
        var detail = _.find (forecast.list, function (o) {
          /* forecast timestamps are in Unix format (seconds) not
           * milliseconds
           */
          return moment.unix (o.dt).isSame (moment.utc (timestamp).millisecond (0));
        });

        /* May be undefined if the find fails */
        return detail;
      } else {
        return undefined;
      }
    };
  });

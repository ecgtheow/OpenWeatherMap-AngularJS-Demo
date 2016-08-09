'use strict';

var angular = require ('angular');
var moment = require ('moment');
var _ = require ('lodash');

angular.module ('openWeatherMapApp')
  .controller ('ForecastListController', function ($scope, CityList, OpenWeatherMap, Settings) {
    var self = this;

    self.searchItem = '';
    self.cityNames = CityList.cityNames;
    self.retrieved = [];

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

    self.unit = function () {
      return Settings.getUnit ();
    };

    self.setUnit = function (unit) {
      Settings.setUnit (unit);
    };

    self.displayTime = function (timestamp) {
      return moment (timestamp).format ('h a');
    };

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

'use strict';

var angular = require ('angular');
var _ = require ('lodash');

var cities = require ('../../../assets/city.list.gb.json');

angular.module ('openWeatherMapApp')
  .factory ('CityList', function () {
    function getCityIDByName (name) {
      /* Where multiple cities have the same name, the list does not
       * offer any disambiguating info other than lat/long.  We could
       * try popping up a map to choose the right one...
       */
      var city = _.find (cities, function (o) {
        return o.name.toLowerCase () === name.toLowerCase ();
      });

      if (city) {
        return city._id;
      } else {
        return -1;
      }
    }

    var cityNames = cities.map (function (cur) {
      return cur.name;
    }).sort (function (a, b) {
      return a.localeCompare (b);
    });

    return {
      getCityIDByName: getCityIDByName,
      cityNames: cityNames
    };
  });

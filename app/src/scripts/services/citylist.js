'use strict';

var angular = require ('angular');
var _ = require ('lodash');

var cities = require ('../../../assets/city.list.gb.json');

/**
 * @ngdoc service
 * @name openWeatherMapApp.service:CityList
 *
 * @description
 *  Maintains a list of well-known cities.
 */
angular.module ('openWeatherMapApp')
  .factory ('CityList', function () {
    /**
     * @ngdoc method
     * @name getCityIDByName
     * @methodOf openWeatherMapApp.service:CityList
     *
     * @description
     *  Looks up the ID of a city
     *
     * @param {string} name The name of a city to use to look up its ID.
     *
     * @returns {number} The ID of the city, or -1 if not known.
     */
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

    /**
     * @ngdoc property
     * @name cityNames
     * @propertyOf openWeatherMapApp.service:CityList
     *
     * @description
     *  A list of well-known city names
     *
     * @returns {array} The list of well-known city names
     */
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

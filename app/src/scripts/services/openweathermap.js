'use strict';

var angular = require ('angular');

angular.module ('openWeatherMapApp')
  .factory ('OpenWeatherMap', function ($http, $q, $window) {
    var baseUrl = 'http://api.openweathermap.org/data/2.5/forecast';

    /* Would rather add an x-api-key header, but OpenWeatherMap
     * insists on the CORS OPTIONS request being authenticated, and I
     * couldn't figure out how to get Angular to add the header to the
     * OPTIONS preflight request
     */
    var appID = '&APPID=7160330ee849b71305f95fccc10a73ad';

    function forecast5DayByName (name) {
      /* Encode any special characters */
      var url = baseUrl + '?q=' + $window.encodeURIComponent (name) + appID;

      return $http ({
        method: 'GET',
        url: url
      }).then (function (response) {
        if (!response.data.cod ||
            response.data.cod !== '200') {
          return $q.reject (response.data.message || 'Error: Unknown failure');
        }

        /* Remove the $http response wrapping */
        return response.data;
      });
    }

    function forecast5DayById (id) {
      /* Check that id is a numeric value */
      if (Number.isNaN (Number (id))) {
        return forecast5DayByName (id);
      }

      var url = baseUrl + '?id=' + id + appID;

      return $http ({
        method: 'GET',
        url: url
      }).then (function (response) {
        if (!response.data.cod ||
            response.data.cod !== '200') {
          return $q.reject (response.data.message || 'Error: Unknown failure');
        }

        /* Remove the $http response wrapping */
        return response.data;
      });
    }

    return {
      forecast5DayByName: forecast5DayByName,
      forecast5DayById: forecast5DayById
    };
  });

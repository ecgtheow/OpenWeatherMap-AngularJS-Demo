'use strict';

var angular = require ('angular');

angular.module ('openWeatherMapApp')
  .factory ('Settings', function () {
    var settings = {
      units: 'C'
    };

    function getUnit () {
      return settings.units;
    }

    function setUnit (unit) {
      if (unit === 'C' ||
          unit === 'F' ||
          unit === 'K') {
        settings.units = unit;
      }
    }

    return {
      getUnit: getUnit,
      setUnit: setUnit
    };
  });

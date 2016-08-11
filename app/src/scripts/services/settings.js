'use strict';

var angular = require ('angular');

/**
 * @ngdoc service
 * @name openWeatherMapApp.service:Settings
 *
 * @description
 *  Maintains settings.  Currently temperature units can be set.
 */
angular.module ('openWeatherMapApp')
  .factory ('Settings', function () {
    var settings = {
      units: 'C'
    };

    /**
     * @ngdoc method
     * @name getUnit
     * @methodOf openWeatherMapApp.service:Settings
     *
     * @description
     *  The currently selected temperature unit
     *
     * @returns {string} The selected temperature unit.  It defaults to `'C'`.
     */
    function getUnit () {
      return settings.units;
    }

    /**
     * @ngdoc method
     * @name setUnit
     * @methodOf openWeatherMapApp.service:Settings
     *
     * @description
     *  Sets the temperature unit to use
     *
     * @param {string} unit The temperature unit to set.  If the unit
     * is neither `'C'`, `'F'` nor `'K'` it does nothing.
     */
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

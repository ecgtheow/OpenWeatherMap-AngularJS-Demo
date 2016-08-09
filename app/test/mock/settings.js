'use strict';

var angular = require ('angular');

angular.module ('SettingsMock', [])
  .service ('Settings', function () {
    this.unit = 'K';

    this.setUnit = function (unit) {
      this.unit = unit;
    };

    this.getUnit = function () {
      return this.unit;
    };
  });

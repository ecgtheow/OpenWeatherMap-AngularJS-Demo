'use strict';

var angular = require ('angular');

angular.module ('CityListMock', [])
  .service ('CityList', function () {
    this.cityID = 0;

    this.setCityID = function (id) {
      this.cityID = id;
    };

    this.getCityIDByName = function (name) {
      return this.cityID;
    };

    this.cityNames = [
      'city 1',
      'city 2',
      'city 3'
    ];
  });

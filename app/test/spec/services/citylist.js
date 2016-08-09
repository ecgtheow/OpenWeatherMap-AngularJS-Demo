'use strict';

var angular = require ('angular');

describe ('Service: CityList', function () {
  beforeEach (angular.mock.module ('openWeatherMapApp'));
  beforeEach (angular.mock.module ('openWeatherMapApp.Templates'));

  var CityList;

  beforeEach (inject (function (_CityList_) {
    CityList = _CityList_;
  }));

  it ('should define function getCityIDByName', function () {
    expect (CityList.getCityIDByName).toBeDefined ();
    expect (CityList.getCityIDByName).toEqual (jasmine.any (Function));
  });

  it ('should define array cityNames', function () {
    expect (CityList.cityNames).toBeDefined ();
    expect (CityList.cityNames).toEqual (jasmine.any (Array));
  });

  describe ('getCityIDByName ()', function () {
    var ret;

    describe ('City is found', function () {
      beforeEach (function () {
        ret = CityList.getCityIDByName ('Swansea');
      });

      it ('should return a positive value', function () {
        expect (ret).not.toEqual (-1);
      });
    });

    describe ('City is not found', function () {
      beforeEach (function () {
        ret = CityList.getCityIDByName ('BackOfBeyondSomewhere');
      });

      it ('should return -1', function () {
        expect (ret).toEqual (-1);
      });
    });
  });
});

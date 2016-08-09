'use strict';

var angular = require ('angular');
var moment = require ('moment');

describe ('Controller: ForecastList', function () {
  beforeEach (angular.mock.module ('openWeatherMapApp'));
  beforeEach (angular.mock.module ('openWeatherMapApp.Templates'));
  beforeEach (angular.mock.module ('CityListMock'));
  beforeEach (angular.mock.module ('OpenWeatherMapMock'));
  beforeEach (angular.mock.module ('SettingsMock'));

  var ctrl;
  var $q;
  var $timeout;
  var CityListMock;
  var OpenWeatherMapMock;
  var SettingsMock;
  var scope;

  beforeEach (inject (function ($controller, _$rootScope_, _$q_, _$timeout_,
                                _CityList_, _OpenWeatherMap_, _Settings_) {
    scope = _$rootScope_.$new ();

    $q = _$q_;
    $timeout = _$timeout_;
    CityListMock = _CityList_;
    OpenWeatherMapMock = _OpenWeatherMap_;
    SettingsMock = _Settings_;

    ctrl = $controller ('ForecastListController', {
      $scope: scope,
      CityList: CityListMock,
      OpenWeatherMap: OpenWeatherMapMock,
      Settings: SettingsMock
    });
  }));

  describe ('advanceTimesTimer ()', function () {
    it ('should have 4 elements in displayTimes', function () {
      expect (ctrl.displayTimes.length).toEqual (4);
    });

    beforeEach (function () {
      jasmine.clock ().install ();
    });

    afterEach (function () {
      jasmine.clock ().uninstall ();
    });

    describe ('Timer tick', function () {
      beforeEach (function () {
        spyOn (ctrl.displayTimes, 'splice').and.callThrough ();
        spyOn (ctrl.displayTimes, 'push').and.callThrough ();

        /* Make the timestamps default to 'now' */
        ctrl.displayTimes[0] = undefined;
        ctrl.displayTimes[3] = undefined;

        ctrl.advanceTimesTimer ();

        /* A second should be plenty! */
        jasmine.clock ().tick (1000);
      });

      it ('should remove the first element of displayTimes', function () {
        expect (ctrl.displayTimes.splice).toHaveBeenCalledWith (0, 1);
      });

      it ('should append a new element to displayTimes', function () {
        expect (ctrl.displayTimes.push).toHaveBeenCalled ();
      });
    });
  });

  describe ('unit ()', function () {
    beforeEach (function () {
      spyOn (SettingsMock, 'getUnit').and.callThrough ();

      ctrl.unit ();
    });

    it ('should have called Settings.getUnit ()', function () {
      expect (SettingsMock.getUnit).toHaveBeenCalled ();
    });
  });

  describe ('setUnit ()', function () {
    var unit;

    beforeEach (function () {
      unit = 'X';

      spyOn (SettingsMock, 'setUnit').and.callThrough ();

      ctrl.setUnit (unit);
    });

    it ('should have called Settings.setUnit ()', function () {
      expect (SettingsMock.setUnit).toHaveBeenCalledWith (unit);
    });
  });

  describe ('displayTime ()', function () {
    it ('should return a String', function () {
      expect (ctrl.displayTime ()).toEqual (jasmine.any (String));
    });
  });

  describe ('getForecast ()', function () {
    var retrievedLength;

    beforeEach (function () {
      retrievedLength = ctrl.retrieved.length;
    });

    describe ('Forecast calls fail', function () {
      beforeEach (function () {
        spyOn (OpenWeatherMapMock, 'forecast5DayById').and.returnValue ($q.reject ('Fail'));
        spyOn (CityListMock, 'getCityIDByName').and.returnValue (123);

        ctrl.getForecast ();

        /* resolve promises */
        $timeout.flush ();
      });

      it ('should not have appended to the retrieved array', function () {
        expect (ctrl.retrieved.length).toEqual (retrievedLength);
      });
    });

    describe ('Forecast calls succeed', function () {
      beforeEach (function () {
        spyOn (OpenWeatherMapMock, 'forecast5DayByName').and.returnValue ($q.resolve ());
        spyOn (OpenWeatherMapMock, 'forecast5DayById').and.returnValue ($q.resolve ());
      });

      describe ('City ID is known', function () {
        beforeEach (function () {
          spyOn (CityListMock, 'getCityIDByName').and.returnValue (123);

          ctrl.getForecast ();

          /* resolve promises */
          $timeout.flush ();
        });

        it ('should have called OpenWeatherMap.forecast5DayById ()', function () {
          expect (OpenWeatherMapMock.forecast5DayById).toHaveBeenCalled ();
        });

        it ('should not have called OpenWeatherMap.forecast5DayByName ()', function () {
          expect (OpenWeatherMapMock.forecast5DayByName).not.toHaveBeenCalled ();
        });

        it ('should have appended to the retrieved array', function () {
          expect (ctrl.retrieved.length).not.toEqual (retrievedLength);
        });
      });

      describe ('City ID is not known', function () {
        beforeEach (function () {
          spyOn (CityListMock, 'getCityIDByName').and.returnValue (-1);

          ctrl.getForecast ();

          /* resolve promises */
          $timeout.flush ();
        });

        it ('should not have called OpenWeatherMap.forecast5DayById ()', function () {
          expect (OpenWeatherMapMock.forecast5DayById).not.toHaveBeenCalled ();
        });

        it ('should have called OpenWeatherMap.forecast5DayByName ()', function () {
          expect (OpenWeatherMapMock.forecast5DayByName).toHaveBeenCalled ();
        });

        it ('should have appended to the retrieved array', function () {
          expect (ctrl.retrieved.length).not.toEqual (retrievedLength);
        });
      });
    });
  });

  describe ('forecastCity ()', function () {
    describe ('forecast is not set', function () {
      it ('should return the empty string', function () {
        expect (ctrl.forecastCity ()).toEqual ('');
      });
    });

    describe ('forecast is set but forecast.city is not', function () {
      it ('should return the empty string', function () {
        expect (ctrl.forecastCity ({})).toEqual ('');
      });
    });

    describe ('forecast.city is set but is empty', function () {
      it ('should return the empty string', function () {
        expect (ctrl.forecastCity ({
          city: {}
        })).toEqual ('');
      });
    });

    describe ('forecast.city.name is set, but forecast.city.country is not', function () {
      it ('should return a non empty string', function () {
        var forecast = {
          city: {
            name: 'Name'
          }
        };

        expect (ctrl.forecastCity (forecast)).toEqual (jasmine.any (String));
        expect (ctrl.forecastCity (forecast)).not.toEqual ('');
      });
    });

    describe ('forecast.city.name and forecast.city.country are both set', function () {
      it ('should return a non empty string', function () {
        var forecast = {
          city: {
            name: 'Name',
            country: 'Country'
          }
        };

        expect (ctrl.forecastCity (forecast)).toEqual (jasmine.any (String));
        expect (ctrl.forecastCity (forecast)).not.toEqual ('');
      });
    });
  });

  describe ('forecastDetail ()', function () {
    describe ('forecast is not set', function () {
      it ('should return undefined', function () {
        expect (ctrl.forecastDetail ()).toBeUndefined ();
      });
    });

    describe ('forecast is set', function () {
      describe ('timestamp is not found in forecast list', function () {
        it ('should return undefined', function () {
          expect (ctrl.forecastDetail ({
            list: [{}]
          })).toBeUndefined ();
        });
      });

      describe ('timestamp is found in forecast list', function () {
        var detail;
        var timestamp;

        beforeEach (function () {
          timestamp = moment.utc ();

          detail = {
            dt: timestamp.unix ()
          };
        });

        it ('should return an Object', function () {
          expect (ctrl.forecastDetail ({
            list: [detail]
          }, timestamp)).toEqual (detail);
        });
      });
    });
  });
});

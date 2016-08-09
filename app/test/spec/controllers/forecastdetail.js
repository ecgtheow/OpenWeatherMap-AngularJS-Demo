'use strict';

var angular = require ('angular');

describe ('Controller: ForecastDetail', function () {
  beforeEach (angular.mock.module ('openWeatherMapApp'));
  beforeEach (angular.mock.module ('openWeatherMapApp.Templates'));
  beforeEach (angular.mock.module ('SettingsMock'));

  var ctrl;
  var SettingsMock;

  beforeEach (inject (function ($controller, _Settings_) {
    SettingsMock = _Settings_;

    ctrl = $controller ('ForecastDetailController', {
      Settings: SettingsMock
    });
  }));

  describe ('weatherIcon ()', function () {
    describe ('forecast is not set', function () {
      beforeEach (function () {
        ctrl.forecast = undefined;
      });

      it ('should return the empty string', function () {
        expect (ctrl.weatherIcon ()).toEqual ('');
      });
    });

    describe ('forecast is set but forecast.weather is not', function () {
      beforeEach (function () {
        ctrl.forecast = {};
      });

      it ('should return the empty string', function () {
        expect (ctrl.weatherIcon ()).toEqual ('');
      });
    });

    describe ('forecast.weather is set but is empty', function () {
      beforeEach (function () {
        ctrl.forecast = {
          weather: []
        };
      });

      it ('should return the empty string', function () {
        expect (ctrl.weatherIcon ()).toEqual ('');
      });
    });

    describe ('forecast.weather[0] is set', function () {
      beforeEach (function () {
        ctrl.forecast = {
          weather: [{
            icon: 'icon'
          }]
        };
      });

      it ('should return a non empty string', function () {
        expect (ctrl.weatherIcon ()).toEqual (jasmine.any (String));
        expect (ctrl.weatherIcon ()).not.toEqual ('');
      });
    });
  });

  describe ('weatherDescription ()', function () {
    describe ('forecast is not set', function () {
      beforeEach (function () {
        ctrl.forecast = undefined;
      });

      it ('should return the empty string', function () {
        expect (ctrl.weatherDescription ()).toEqual ('');
      });
    });

    describe ('forecast is set but forecast.weather is not', function () {
      beforeEach (function () {
        ctrl.forecast = {};
      });

      it ('should return the empty string', function () {
        expect (ctrl.weatherDescription ()).toEqual ('');
      });
    });

    describe ('forecast.weather is set but is empty', function () {
      beforeEach (function () {
        ctrl.forecast = {
          weather: []
        };
      });

      it ('should return the empty string', function () {
        expect (ctrl.weatherDescription ()).toEqual ('');
      });
    });

    describe ('forecast.weather[0] is set', function () {
      beforeEach (function () {
        ctrl.forecast = {
          weather: [{
            description: 'description'
          }]
        };
      });

      it ('should return a non empty string', function () {
        expect (ctrl.weatherDescription ()).toEqual (jasmine.any (String));
        expect (ctrl.weatherDescription ()).not.toEqual ('');
      });
    });
  });

  describe ('temperature ()', function () {
    describe ('forecast is not set', function () {
      beforeEach (function () {
        ctrl.forecast = undefined;
      });

      it ('should return the empty string', function () {
        expect (ctrl.temperature ()).toEqual ('');
      });
    });

    describe ('forecast is set but forecast.main is not', function () {
      beforeEach (function () {
        ctrl.forecast = {};
      });

      it ('should return the empty string', function () {
        expect (ctrl.temperature ()).toEqual ('');
      });
    });

    describe ('forecast.main is set but is empty', function () {
      beforeEach (function () {
        ctrl.forecast = {
          main: {}
        };
      });

      it ('should return the empty string', function () {
        expect (ctrl.temperature ()).toEqual ('');
      });
    });

    describe ('forecast.main.temp is set', function () {
      beforeEach (function () {
        ctrl.forecast = {
          main: {
            temp: 'temp'
          }
        };
      });

      describe ('Settings unit is \'C\'', function () {
        beforeEach (function () {
          SettingsMock.setUnit ('C');
        });

        it ('should return a non empty string', function () {
          expect (ctrl.temperature ()).toEqual (jasmine.any (String));
          expect (ctrl.temperature ()).not.toEqual ('');
        });
      });

      describe ('Settings unit is \'F\'', function () {
        beforeEach (function () {
          SettingsMock.setUnit ('F');
        });

        it ('should return a non empty string', function () {
          expect (ctrl.temperature ()).toEqual (jasmine.any (String));
          expect (ctrl.temperature ()).not.toEqual ('');
        });
      });

      describe ('Settings unit is \'K\'', function () {
        beforeEach (function () {
          SettingsMock.setUnit ('K');
        });

        it ('should return a non empty string', function () {
          expect (ctrl.temperature ()).toEqual (jasmine.any (String));
          expect (ctrl.temperature ()).not.toEqual ('');
        });
      });

      describe ('Settings unit is something else', function () {
        beforeEach (function () {
          SettingsMock.setUnit ('Z');
        });

        it ('should return a non empty string', function () {
          expect (ctrl.temperature ()).toEqual (jasmine.any (String));
          expect (ctrl.temperature ()).not.toEqual ('');
        });
      });
    });
  });

  describe ('rain ()', function () {
    describe ('forecast is not set', function () {
      beforeEach (function () {
        ctrl.forecast = undefined;
      });

      it ('should return the empty string', function () {
        expect (ctrl.rain ()).toEqual ('');
      });
    });

    describe ('forecast is set but forecast.rain is not', function () {
      beforeEach (function () {
        ctrl.forecast = {};
      });

      it ('should return the empty string', function () {
        expect (ctrl.rain ()).toEqual ('');
      });
    });

    describe ('forecast.rain is set but is empty', function () {
      beforeEach (function () {
        ctrl.forecast = {
          rain: {}
        };
      });

      it ('should return the empty string', function () {
        expect (ctrl.rain ()).toEqual ('');
      });
    });

    describe ('forecast.rain.3h is set', function () {
      beforeEach (function () {
        ctrl.forecast = {
          rain: {
            '3h': 'rain'
          }
        };
      });

      it ('should return a non empty string', function () {
        expect (ctrl.rain ()).toEqual (jasmine.any (String));
        expect (ctrl.rain ()).not.toEqual ('');
      });
    });
  });

  describe ('windSpeed ()', function () {
    describe ('forecast is not set', function () {
      beforeEach (function () {
        ctrl.forecast = undefined;
      });

      it ('should return the empty string', function () {
        expect (ctrl.windSpeed ()).toEqual ('');
      });
    });

    describe ('forecast is set but forecast.wind is not', function () {
      beforeEach (function () {
        ctrl.forecast = {};
      });

      it ('should return the empty string', function () {
        expect (ctrl.windSpeed ()).toEqual ('');
      });
    });

    describe ('forecast.wind is set but is empty', function () {
      beforeEach (function () {
        ctrl.forecast = {
          wind: {}
        };
      });

      it ('should return the empty string', function () {
        expect (ctrl.windSpeed ()).toEqual ('');
      });
    });

    describe ('forecast.wind.speed is set', function () {
      beforeEach (function () {
        ctrl.forecast = {
          wind: {
            speed: 'speed'
          }
        };
      });

      it ('should return a non empty string', function () {
        expect (ctrl.windSpeed ()).toEqual (jasmine.any (String));
        expect (ctrl.windSpeed ()).not.toEqual ('');
      });
    });
  });

  describe ('windDirection ()', function () {
    describe ('forecast is not set', function () {
      beforeEach (function () {
        ctrl.forecast = undefined;
      });

      it ('should return the empty string', function () {
        expect (ctrl.windDirection ()).toEqual ('');
      });
    });

    describe ('forecast is set but forecast.wind is not', function () {
      beforeEach (function () {
        ctrl.forecast = {};
      });

      it ('should return the empty string', function () {
        expect (ctrl.windDirection ()).toEqual ('');
      });
    });

    describe ('forecast.wind is set but is empty', function () {
      beforeEach (function () {
        ctrl.forecast = {
          wind: {}
        };
      });

      it ('should return the empty string', function () {
        expect (ctrl.windDirection ()).toEqual ('');
      });
    });

    describe ('forecast.wind.deg is set', function () {
      beforeEach (function () {
        ctrl.forecast = {
          wind: {
            deg: 'deg'
          }
        };
      });

      it ('should return a non empty string', function () {
        expect (ctrl.windDirection ()).toEqual (jasmine.any (String));
        expect (ctrl.windDirection ()).not.toEqual ('');
      });
    });
  });
});

'use strict';

var angular = require ('angular');

describe ('Service: Settings', function () {
  beforeEach (angular.mock.module ('openWeatherMapApp'));
  beforeEach (angular.mock.module ('openWeatherMapApp.Templates'));

  var Settings;

  beforeEach (inject (function (_Settings_) {
    Settings = _Settings_;
  }));

  it ('should define function getUnit', function () {
    expect (Settings.getUnit).toBeDefined ();
    expect (Settings.getUnit).toEqual (jasmine.any (Function));
  });

  it ('should define function setUnit', function () {
    expect (Settings.setUnit).toBeDefined ();
    expect (Settings.setUnit).toEqual (jasmine.any (Function));
  });

  describe ('getUnit ()', function () {
    it ('should default to \'C\'', function () {
      expect (Settings.getUnit ()).toEqual ('C');
    });
  });

  describe ('setUnit ()', function () {
    describe ('Set \'C\'', function () {
      beforeEach (function () {
        /* It defaults to 'C', so set something else */
        Settings.setUnit ('K');

        expect (Settings.getUnit ()).toEqual ('K');

        Settings.setUnit ('C');
      });

      it ('should return \'C\' from getUnit ()', function () {
        expect (Settings.getUnit ()).toEqual ('C');
      });
    });

    describe ('Set \'F\'', function () {
      beforeEach (function () {
        Settings.setUnit ('F');
      });

      it ('should return \'F\' from getUnit ()', function () {
        expect (Settings.getUnit ()).toEqual ('F');
      });
    });

    describe ('Set \'K\'', function () {
      beforeEach (function () {
        Settings.setUnit ('K');
      });

      it ('should return \'K\' from getUnit ()', function () {
        expect (Settings.getUnit ()).toEqual ('K');
      });
    });

    describe ('Set something else', function () {
      beforeEach (function () {
        Settings.setUnit ('Z');
      });

      it ('should return \'C\' from getUnit ()', function () {
        expect (Settings.getUnit ()).toEqual ('C');
      });
    });
  });
});

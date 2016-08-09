'use strict';

var angular = require ('angular');

describe ('Service: OpenWeatherMap', function () {
  beforeEach (angular.mock.module ('openWeatherMapApp'));
  beforeEach (angular.mock.module ('openWeatherMapApp.Templates'));

  var OpenWeatherMap;
  var $httpBackend;

  beforeEach (inject (function (_$httpBackend_, _OpenWeatherMap_) {
    $httpBackend = _$httpBackend_;
    OpenWeatherMap = _OpenWeatherMap_;
  }));

  it ('should define function forecast5DayByName', function () {
    expect (OpenWeatherMap.forecast5DayByName).toBeDefined ();
    expect (OpenWeatherMap.forecast5DayByName).toEqual (jasmine.any (Function));
  });

  it ('should define function forecast5DayById', function () {
    expect (OpenWeatherMap.forecast5DayById).toBeDefined ();
    expect (OpenWeatherMap.forecast5DayById).toEqual (jasmine.any (Function));
  });

  describe ('$http calls', function () {
    afterEach (function () {
      $httpBackend.verifyNoOutstandingRequest ();
    });

    describe ('forecast5DayByName ()', function () {
      var urlRE;
      var forecastPromise;

      beforeEach (function () {
        urlRE = /http:\/\/api.openweathermap.org\/data\/2.5\/forecast\?q=(.+)&APPID=(.+)/;

        $httpBackend.expectGET (urlRE, undefined, ['cityName', 'appID']).respond (function (method, url, data, headers, params) {
          var returnData = {};

          if (params.cityName === 'Unknown') {
            returnData.cod = '404';
            returnData.message = 'Unknown City';
          } else if (params.cityName === 'Failure') {
            returnData.cod = '500';
          } else {
            returnData.cod = '200';
            returnData.message = 'OK';
            returnData.city = {
              id: params.cityName.length,
              name: params.cityName
            };
            returnData.list = [];
          }

          return [200, returnData];
        });
      });

      describe ('API failure', function () {
        beforeEach (function () {
          forecastPromise = OpenWeatherMap.forecast5DayByName ('Failure');
        });

        it ('should return a promise that is rejected with a String', function (done) {
          forecastPromise.then (function () {
            /* Fail the test if it gets here */
            expect (false).toBeTruthy ();
          }).catch (function (err) {
            expect (err).toBeDefined ();
            expect (err).toEqual (jasmine.any (String));
          }).finally (function () {
            done ();
          });

          $httpBackend.flush ();

          /* Avoid '$digest already in progress' failure by putting
           * this test here rather than in the afterEach () above.
           */
          $httpBackend.verifyNoOutstandingExpectation ();
        });
      });

      describe ('City is not found', function () {
        beforeEach (function () {
          forecastPromise = OpenWeatherMap.forecast5DayByName ('Unknown');
        });

        it ('should return a promise that is rejected with a String', function (done) {
          forecastPromise.then (function () {
            /* Fail the test if it gets here */
            expect (false).toBeTruthy ();
          }).catch (function (err) {
            expect (err).toBeDefined ();
            expect (err).toEqual (jasmine.any (String));
          }).finally (function () {
            done ();
          });

          $httpBackend.flush ();

          /* Avoid '$digest already in progress' failure by putting
           * this test here rather than in the afterEach () above.
           */
          $httpBackend.verifyNoOutstandingExpectation ();
        });
      });

      describe ('City is found', function () {
        beforeEach (function () {
          forecastPromise = OpenWeatherMap.forecast5DayByName ('Known');
        });

        it ('should return a promise that is resolved with an object', function (done) {
          forecastPromise.then (function (response) {
            expect (response).toBeDefined ();
            expect (response).toEqual (jasmine.any (Object));
          }).catch (function (err) {
            expect (err).toBeUnDefined ();
          }).finally (function () {
            done ();
          });

          $httpBackend.flush ();

          /* Avoid '$digest already in progress' failure by putting
           * this test here rather than in the afterEach () above.
           */
          $httpBackend.verifyNoOutstandingExpectation ();
        });
      });
    });

    describe ('forecast5DayById ()', function () {
      describe ('ID is not a number', function () {
        var urlRE;
        var forecastPromise;

        /* spyOn (OpenWeatherMap, 'forecast5DayByName') doesn't work,
         * as OpenWeatherMap.forecast5DayById () calls the internal
         * function.  So just test that the ByName URL has been
         * queried.
         */
        beforeEach (function () {
          urlRE = /http:\/\/api.openweathermap.org\/data\/2.5\/forecast\?q=(.+)&APPID=(.+)/;

          $httpBackend.expectGET (urlRE, undefined, ['cityName', 'appID']).respond (function (method, url, data, headers, params) {
            var returnData = {};

            if (params.cityName === 'Unknown') {
              returnData.cod = '404';
              returnData.message = 'Unknown City';
            } else if (params.cityName === 'Failure') {
              returnData.cod = '500';
            } else {
              returnData.cod = '200';
              returnData.message = 'OK';
              returnData.city = {
                id: params.cityName.length,
                name: params.cityName
              };
              returnData.list = [];
            }

            return [200, returnData];
          });

          forecastPromise = OpenWeatherMap.forecast5DayById ('NotANumber');
        });

        it ('should return a promise that is resolved with an object', function (done) {
          forecastPromise.then (function (response) {
            expect (response).toBeDefined ();
            expect (response).toEqual (jasmine.any (Object));
          }).catch (function (err) {
            expect (err).toBeUnDefined ();
          }).finally (function () {
            done ();
          });

          $httpBackend.flush ();

          /* Avoid '$digest already in progress' failure by putting
           * this test here rather than in the afterEach () above.
           */
          $httpBackend.verifyNoOutstandingExpectation ();
        });
      });

      describe ('ID is a number', function () {
        var urlRE;
        var forecastPromise;

        beforeEach (function () {
          urlRE = /http:\/\/api.openweathermap.org\/data\/2.5\/forecast\?id=(.+)&APPID=(.+)/;

          $httpBackend.expectGET (urlRE, undefined, ['cityID', 'appID']).respond (function (method, url, data, headers, params) {
            var returnData = {};

            if (params.cityID === '0') {
              returnData.cod = '404';
              returnData.message = 'Unknown City';
            } else if (params.cityID === '-1') {
              returnData.cod = '500';
            } else {
              returnData.cod = '200';
              returnData.message = 'OK';
              returnData.city = {
                id: +params.cityID,
                name: 'Known City'
              };
              returnData.list = [];
            }

            return [200, returnData];
          });
        });

        describe ('API failure', function () {
          beforeEach (function () {
            forecastPromise = OpenWeatherMap.forecast5DayById (-1);
          });

          it ('should return a promise that is rejected with a String', function (done) {
            forecastPromise.then (function () {
              /* Fail the test if it gets here */
              expect (false).toBeTruthy ();
            }).catch (function (err) {
              expect (err).toBeDefined ();
              expect (err).toEqual (jasmine.any (String));
            }).finally (function () {
              done ();
            });

            $httpBackend.flush ();

            /* Avoid '$digest already in progress' failure by putting
             * this test here rather than in the afterEach () above.
             */
            $httpBackend.verifyNoOutstandingExpectation ();
          });
        });

        describe ('City is not found', function () {
          beforeEach (function () {
            forecastPromise = OpenWeatherMap.forecast5DayById (0);
          });

          it ('should return a promise that is rejected with a String', function (done) {
            forecastPromise.then (function () {
              /* Fail the test if it gets here */
              expect (false).toBeTruthy ();
            }).catch (function (err) {
              expect (err).toBeDefined ();
              expect (err).toEqual (jasmine.any (String));
            }).finally (function () {
              done ();
            });

            $httpBackend.flush ();

            /* Avoid '$digest already in progress' failure by putting
             * this test here rather than in the afterEach () above.
             */
            $httpBackend.verifyNoOutstandingExpectation ();
          });
        });

        describe ('City is found', function () {
          beforeEach (function () {
            forecastPromise = OpenWeatherMap.forecast5DayById (123);
          });

          it ('should return a promise that is resolved with an object', function (done) {
            forecastPromise.then (function (response) {
              expect (response).toBeDefined ();
              expect (response).toEqual (jasmine.any (Object));
            }).catch (function (err) {
              expect (err).toBeUnDefined ();
            }).finally (function () {
              done ();
            });

            $httpBackend.flush ();

            /* Avoid '$digest already in progress' failure by putting
             * this test here rather than in the afterEach () above.
             */
            $httpBackend.verifyNoOutstandingExpectation ();
          });
        });
      });
    });
  });
});

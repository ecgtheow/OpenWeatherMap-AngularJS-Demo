'use strict';

var AppPage = require ('../e2e-pageobjects/page');
var Navigation = require ('../e2e-pageobjects/navigation');
var Search = require ('../e2e-pageobjects/search');
var Results = require ('../e2e-pageobjects/results');

describe ('OpenWeatherMapApp home page', function () {
  beforeEach (function (done) {
    AppPage.getHome ().then (function () {
      done ();
    });
  });

  describe ('Navigation bar', function () {
    it ('should display a navigation bar', function (done) {
      expect (Navigation.navbar).toBeDefined ();

      Navigation.navbar.isPresent ().then (function (present) {
        expect (present).toBeTruthy ();

        return Navigation.navbar.isDisplayed ();
      }).then (function (visible) {
        expect (visible).toBeTruthy ();
      }).finally (function () {
        done ();
      });
    });

    describe ('Settings dropdown', function () {
      it ('should display a settings dropdown menu item', function (done) {
        expect (Navigation.settingsDropdown).toBeDefined ();

        Navigation.settingsDropdown.isPresent ().then (function (present) {
          expect (present).toBeTruthy ();

          return Navigation.settingsDropdown.isDisplayed ();
        }).then (function (visible) {
          expect (visible).toBeTruthy ();
        }).finally (function () {
          done ();
        });
      });

      describe ('Settings dropdown click', function () {
        beforeEach (function (done) {
          Navigation.settingsDropdown.click ().then (function () {
            return Navigation.settingsDropdown.waitReady ();
          }).then (function () {
            done ();
          });
        });

        it ('should show an option for degrees C', function (done) {
          Navigation.settingsC.isPresent ().then (function (present) {
            expect (present).toBeTruthy ();

            return Navigation.settingsC.isDisplayed ();
          }).then (function (visible) {
            expect (visible).toBeTruthy ();
          }).finally (function () {
            done ();
          });
        });

        it ('should show an option for degrees F', function (done) {
          Navigation.settingsF.isPresent ().then (function (present) {
            expect (present).toBeTruthy ();

            return Navigation.settingsF.isDisplayed ();
          }).then (function (visible) {
            expect (visible).toBeTruthy ();
          }).finally (function () {
            done ();
          });
        });

        it ('should show an option for degrees K', function (done) {
          Navigation.settingsK.isPresent ().then (function (present) {
            expect (present).toBeTruthy ();

            return Navigation.settingsK.isDisplayed ();
          }).then (function (visible) {
            expect (visible).toBeTruthy ();
          }).finally (function () {
            done ();
          });
        });
      });
    });

    describe ('City input', function () {
      it ('should display a search text input', function (done) {
        expect (Search.cityInput).toBeDefined ();

        Search.cityInput.isPresent ().then (function (present) {
          expect (present).toBeTruthy ();

          return Search.cityInput.isDisplayed ();
        }).then (function (visible) {
          expect (visible).toBeTruthy ();
        }).finally (function () {
          done ();
        });
      });

      it ('should display a search button', function (done) {
        expect (Search.searchButton).toBeDefined ();

        Search.searchButton.isPresent ().then (function (present) {
          expect (present).toBeTruthy ();

          return Search.searchButton.isDisplayed ();
        }).then (function (visible) {
          expect (visible).toBeTruthy ();
        }).finally (function () {
          done ();
        });
      });

      describe ('Search button', function () {
        it ('should default to disabled', function () {
          expect (Search.searchButton.isEnabled ()).toBeFalsy ();
        });

        it ('should become enabled when text has been entered into the input', function (done) {
          Search.cityInput.sendKeys ('a').then (function () {
            expect (Search.searchButton.isEnabled ()).toBeTruthy ();
          }).finally (function () {
            done ();
          });
        });
      });

      describe ('Search input', function () {
        var resultsCount;

        beforeEach (function (done) {
          Results.resultsCount ().then (function (count) {
            resultsCount = count;
          }).finally (function () {
            done ();
          });
        });

        it ('should start with no results', function () {
          expect (resultsCount).toEqual (0);
        });

        it ('should add a result row when a search is initiated', function (done) {
          Search.cityInput.sendKeys ('London, GB').then (function () {
            return Search.searchButton.click ();
          }).then (function () {
            return browser.waitForAngular ();
          }).then (function () {
            return Results.resultsCount ();
          }).then (function (count) {
            expect (count).toBeGreaterThan (0);
          }).finally (function () {
            done ();
          });
        });
      });
    });
  });
});

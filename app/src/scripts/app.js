'use strict';

var angular = require ('angular');
require ('angular-animate');
require ('angular-aria');
require ('angular-sanitize');
require ('angular-touch');
require ('angular-ui-bootstrap');

require ('templates');

angular
  .module ('openWeatherMapApp', [
    'openWeatherMapApp.Templates',
    'ngAnimate',
    'ngAria',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
  ]);

require ('./controllers/forecastlist');
require ('./controllers/forecastdetail');
require ('./directives/forecastdetail');
require ('./services/citylist');
require ('./services/openweathermap');
require ('./services/settings');

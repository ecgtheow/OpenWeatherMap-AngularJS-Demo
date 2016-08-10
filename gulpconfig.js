'use strict';

var path = require ('path');

/* Create the browserSync instance here, so it can be shared between
 * the files in gulp-tasks
 */
var browserSync = require ('browser-sync').create ();

var config = {};

config.rootDir = __dirname;
config.glpPattern = ['gulp-*', 'uglify-save-license', 'del'];
config.seleniumVersions = {
  selenium: '2.53.1',
  chrome: '2.21',
  gecko: '0.9.0'
};
config.serverPorts = {
  bsDevel: 4300,
  bsDevelUi: 4301,
  bsProd: 4400,
  bsProdUi: 4401
};
config.protractorParams = {
  browserSizes: {
    xs: {
      width: 600,
      height: 800
    },
    sm: {
      width: 800,
      height: 1024
    },
    md: {
      width: 1000,
      height: 1024
    },
    lg: {
      width: 1200,
      height: 1024
    }
  }
};
config.e2eBrowsers = ['chrome', 'firefox', 'safari'];
config.e2eSizes = ['xs', 'sm', 'md', 'lg'];
config.appData = {
  appMain: 'app.js',
  appTemplatePrefix: '/views/',
  appTemplateModule: 'openWeatherMapApp.Templates',
  appTemplate: 'templates.js'
};
config.srcDirs = {
  app: path.join (config.rootDir, 'app', 'src'),
  appGenerated: path.join (config.rootDir, 'app', 'generated-src'),
  appScripts: path.join (config.rootDir, 'app', 'src', 'scripts'),
  appTest: path.join (config.rootDir, 'app', 'test')
};
config.destDirs = {
  build: path.join (config.rootDir, 'build'),
  buildScripts: path.join (config.rootDir, 'build', 'scripts'),
  buildStyles: path.join (config.rootDir, 'build', 'styles'),
  buildAssets: path.join (config.rootDir, 'build', 'assets'),
  dist: path.join (config.rootDir, 'dist'),
  distScripts: path.join (config.rootDir, 'dist', 'scripts'),
  distStyles: path.join (config.rootDir, 'dist', 'styles'),
  distAssets: path.join (config.rootDir, 'dist', 'assets'),
  docs: path.join (config.rootDir, 'docs')
};
config.appFiles = {
  appBaseHTML: [
    path.join (config.srcDirs.app, 'index.html')
  ],
  appJS: [
    path.join (config.srcDirs.appScripts, '*.js'),
    path.join (config.srcDirs.appScripts, '**', '*.js')
  ],
  appTestJS: [
    path.join (config.srcDirs.appTest, 'spec', '**', '*.js')
  ],
  appE2EJS: [
    path.join (config.srcDirs.appTest, 'e2e', '**', '*.js'),
    path.join (config.srcDirs.appTest, 'e2e-pageobjects', '**', '*.js'),
    path.join (config.srcDirs.appTest, 'e2e-helpers', '**', '*.js')
  ],
  appHTML: [
    path.join (config.srcDirs.app, 'views', '*.html')
  ],
  appSCSS: [
    path.join (config.srcDirs.app, 'styles', '*.scss')
  ],
  appAssets: [
    path.join (config.rootDir, 'node_modules', 'bootstrap-sass', 'assets',
               'fonts', 'bootstrap', '*')
  ],
  gulpJS: [
    path.join (config.rootDir, 'gulp-tasks', '**', '*.js'),
    path.join (config.rootDir, 'gulpconfig.js'),
    path.join (config.rootDir, 'Gulpfile.js')
  ]
};
config.destFiles = {
  appJS: 'app.js',
  vendorJS: 'vendor.js',
  ieShimsJS: 'ie-shims.js',
  appCSS: 'app.css'
};
config.ieShims = [
  'es5-shim',
  'json3'
];
config.vendorIgnore = [
  'bootstrap-sass'
];
config.browserSync = browserSync;

module.exports = config;

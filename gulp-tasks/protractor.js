'use strict';

var path = require ('path');
var child_process = require ('child_process');

var gulp = require ('gulp');
var config = require ('../gulpconfig');

var selenium = require ('selenium-standalone');

var $ = require ('gulp-load-plugins') ({
  pattern: config.glpPattern
});

var seleniumServer;
var develServer;
var browserSyncProd = require ('browser-sync');

function cleanupHandler (options, err) {
  /* Make sure we never leave a selenium server running */
  if (seleniumServer) {
    $.util.log ('Killing selenium server');
    seleniumServer.kill ();
    seleniumServer = undefined;
  }

  if (develServer) {
    develServer.exit ();
    develServer = undefined;
  }

  if (err && err.stack) {
    $.util.log ($.util.colors.red ('cleanup error', err.stack));
  }

  var exitVal = 0;
  if (options && options.exitVal) {
    exitVal = options.exitVal;
  } else if (typeof err === 'number') {
    exitVal = err;
  }

  process.exit (exitVal);
}

process.on ('exit', cleanupHandler.bind (null, {}));
process.on ('SIGINT', cleanupHandler.bind (null, {
  exitVal: 1
}));
process.on ('uncaughtException', cleanupHandler.bind (null, {
  exitVal: 1
}));

gulp.task ('selenium:install', function (done) {
  selenium.install ({
    version: config.seleniumVersions.selenium,
    baseURL: 'http://selenium-release.storage.googleapis.com',
    drivers: {
      chrome: {
        version: config.seleniumVersions.chrome,
        arch: process.arch,
        baseURL: 'http://chromedriver.storage.googleapis.com'
      },
      firefox: {
        version: config.seleniumVersions.gecko,
        arch: process.arch,
        baseURL: 'https://github.com/mozilla/geckodriver/releases/download'
      }
    },
    logger: function (message) {
      $.util.log ($.util.colors.cyan ('selenium:install', message));
    },
    progressCb: function (totalLength, progressLength, chunkLength) {
      process.stdout.write ('selenium:install ' + progressLength + ' / ' + totalLength + '\r');
    }
  }, done);
});

gulp.task ('selenium:start', gulp.series ('selenium:install',
                                          function seleniumStart (done) {
  selenium.start ({
    version: config.seleniumVersions.selenium,
    drivers: {
      chrome: {
        version: config.seleniumVersions.chrome
      }
    }
  }, function (err, child) {
    if (err) {
      done (err);
    } else {
      seleniumServer = child;

      done ();
    }
  });
}));

gulp.task ('selenium:stop', function (done) {
  if (seleniumServer) {
    seleniumServer.kill ();
    seleniumServer = undefined;
  }

  done ();
});

gulp.task ('protractor:server:start', function (done) {
  var port = config.serverPorts.bsProd;

  if (!develServer) {
    develServer = browserSyncProd.create ();

    develServer.init ({
      port: port,
      ui: false,
      server: {
        baseDir: config.destDirs.dist
      },
      snippetOptions: {
        rule: {
          match: /neverloadthesnippetinproductionmode/
        }
      },
      ghostMode: false,
      open: false,
      notify: false,
      injectChanges: false,
      codeSync: false
    }, done);
  } else {
    done ();
  }
});

gulp.task ('protractor:server:stop', function (done) {
  if (develServer) {
    develServer.exit ();
    develServer = undefined;
  }

  done ();
});

function runProtractor (browser, size, done) {
  var port = config.serverPorts.bsProd;
  var url = 'http://127.0.0.1:' + port + '/';

  if (browser === 'safari' && process.platform !== 'darwin') {
    return done ();
  }

  if (browser === 'firefox') {
    /* firefox support doesn't work any more due to extension loading snafu */
    return done ();
  }

  var params = {
    profileName: browser + '_' + size,
    size: config.protractorParams.browserSizes[size]
  };
  var args = [path.join (config.srcDirs.appTest, 'protractor.conf.js'),
              '--baseUrl', url,
              '--browser', browser
             ];

  function iterateParams (obj, propname) {
    Object.keys (obj).forEach (function (prop) {
      if (typeof obj[prop] === 'object') {
        iterateParams (obj[prop], propname + '.' + prop);
      } else {
        args.push (propname + '.' + prop);
        args.push (obj[prop]);
      }
    });
  }
  iterateParams (params, '--params');

  function findProtractor () {
    var pkg = require.resolve ('protractor');
    if (pkg) {
      return path.resolve (path.join (path.dirname (pkg), '..', 'bin', 'protractor'));
    } else {
      throw new Error ('No protractor installation found');
    }
  }

  $.util.log ('Starting protractor...');

  var child = child_process.spawn (findProtractor (), args, {
    stdio: 'inherit'
  }).on ('exit', function (code) {
    if (child) {
      child.kill ();
    }

    if (code) {
      /* error */
      done (new Error ('protractor:' + browser + ':' + size + ' failed'));
    } else {
      done ();
    }
  });
}

gulp.task ('protractor:setup', gulp.series ('compile:app:prod:all',
                                            'selenium:start',
                                            'protractor:server:start'));

gulp.task ('protractor:teardown', gulp.series ('protractor:server:stop',
                                               'selenium:stop'));

config.e2eBrowsers.forEach (function (browserType) {
  config.e2eSizes.forEach (function (sizeType) {
    gulp.task ('protractor:' + browserType + ':' + sizeType + ':internal',
               gulp.series (function callRunProtractor (done) {
      runProtractor (browserType, sizeType, done);
    }));

    gulp.task ('protractor:' + browserType + ':' + sizeType,
               gulp.series ('protractor:setup',
                            'protractor:' + browserType + ':' + sizeType + ':internal',
                            'protractor:teardown'));
  });

  gulp.task ('protractor:' + browserType + ':internal',
             gulp.series (gulp.parallel (config.e2eSizes.map (function (sizeType) {
                            return 'protractor:' + browserType + ':' + sizeType + ':internal';
                          }))));

  gulp.task ('protractor:' + browserType,
             gulp.series ('protractor:setup',
                          'protractor:' + browserType + ':internal',
                          'protractor:teardown'));
});

gulp.task ('protractor', gulp.series ('protractor:setup',
                                      gulp.parallel (config.e2eBrowsers.map (function (browserType) {
                                        return 'protractor:' + browserType + ':internal';
                                      })),
                                      'protractor:teardown'));

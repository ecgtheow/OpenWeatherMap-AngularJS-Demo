'use strict';

var path = require ('path');

var gulp = require ('gulp');
var config = require ('../gulpconfig');

gulp.task ('browser-sync:dev', function (done) {
  config.browserSync.init ({
    port: config.serverPorts.bsDevel,
    ui: {
      port: config.serverPorts.bsDevelUi
    },
    server: {
      baseDir: config.destDirs.build
    },
    ghostMode: false,
    open: false,
    injectChanges: true,
    codeSync: true,
    reloadDebounce: 2000
  }, done);
});

function watcher (done) {
  gulp.watch ([
    config.appFiles.gulpJS
  ], {
    delay: 500,
    queue: true
  }, gulp.series ('lint:gulp'))
    .on ('error', function () {
    });

  gulp.watch ([
    config.appFiles.appBaseHTML,
    config.appFiles.appHTML
  ], {
    queue: true
  }, gulp.series ('compile:app:devel',
                  function (done) {
                    config.browserSync.reload ();
                    done ();
                  }))
    .on ('error', function () {
    });

  gulp.watch ([
    config.appFiles.appJS
  ], {
    queue: true
  }, gulp.series ('lint:app',
                  'compile:app:devel',
                  'test:app',
                  function (done) {
                    config.browserSync.reload ();
                    done ();
                  }))
    .on ('error', function () {
    });

  gulp.watch ([
    config.appFiles.appSCSS
  ], {
    queue: true
  }, gulp.series ('lint:app:styles',
                  'compile:app:devel:styles',
                  function (done) {
                    config.browserSync.reload ();
                    done ();
                  }))
    .on ('error', function () {
    });

  gulp.watch ([
    config.appFiles.appTestJS
  ], {
    delay: 2000,
    queue: true
  }, gulp.series ('lint:app',
                  'lint:app:test',
                  'test:app'))
    .on ('error', function () {
    });

  gulp.watch ([
    path.join (config.rootDir, 'package.json')
  ], {
    delay: 2000,
    queue: true
  }, gulp.series ('compile:app:devel:ieshims',
                  'compile:app:devel:vendor'))
    .on ('error', function () {
    });

  done ();
}

gulp.task ('serve', gulp.series (//'docs',
                                 'compile:app:devel:all',
                                 'browser-sync:dev',
                                 watcher));

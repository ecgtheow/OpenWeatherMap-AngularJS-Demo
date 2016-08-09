'use strict';

var path = require ('path');

var gulp = require ('gulp');
var config = require ('../gulpconfig');

var _ = require ('lodash');
var browserify = require ('browserify');
var sourcemapify = require ('sourcemapify');
var source = require ('vinyl-source-stream');
var buffer = require ('vinyl-buffer');
var requireNew = require ('require-new');

var $ = require ('gulp-load-plugins') ({
  pattern: config.glpPattern
});

function getNPMDependencies () {
  var packageJson = {};

  try {
    /* use require-new to avoid the require cache.  Otherwise
     * newly-added packages won't be picked up.
     */
    packageJson = requireNew (path.join (config.rootDir, 'package.json'));
  } catch (e) {
  }

  return _.keys (packageJson.dependencies) || [];
}

gulp.task ('compile:app:devel:copystatic', function compileAppDevelCopyStatic () {
  return gulp.src (config.appFiles.appBaseHTML)
    .pipe (gulp.dest (config.destDirs.build));
});

gulp.task ('compile:app:prod:copystatic', function compileAppProdCopyStatic () {
  return gulp.src (config.appFiles.appBaseHTML)
    .pipe ($.htmlmin ({
      collapseWhitespace: true
    }))
    .pipe (gulp.dest (config.destDirs.dist));
});

gulp.task ('compile:app:devel:copyassets', function compileAppDevelCopyAssets () {
  return gulp.src (config.appFiles.appAssets, {
    base: path.join (config.rootDir, 'node_modules')
  })
    .pipe (gulp.dest (config.destDirs.buildAssets));
});

gulp.task ('compile:app:prod:copyassets', function compileAppProdCopyAssets () {
  return gulp.src (config.appFiles.appAssets, {
    base: path.join (config.rootDir, 'node_modules')
  })
    .pipe (gulp.dest (config.destDirs.distAssets));
});

gulp.task ('compile:app:devel:styles', function compileAppDevelStyles () {
  var sassOpts = {
    outputStyle: 'expanded',
    precision: 10,
    sourceComments: true,
    includePaths: [path.join (config.rootDir, 'node_modules')]
  };
  var apOpts = {
    browsers: ['last 1 version']
  };

  return gulp.src (config.appFiles.appSCSS)
    .pipe ($.sourcemaps.init ())
    .pipe ($.sass (sassOpts))
    .pipe ($.autoprefixer (apOpts))
    .pipe ($.rename (config.destFiles.appCSS))
    .pipe ($.sourcemaps.write ())
    .pipe (gulp.dest (config.destDirs.buildStyles));
});

gulp.task ('compile:app:prod:styles', function compileAppProdStyles () {
  var sassOpts = {
    outputStyle: 'expanded',
    precision: 10,
    sourceComments: true,
    includePaths: [path.join (config.rootDir, 'node_modules')]
  };
  var apOpts = {
    browsers: ['last 1 version']
  };

  return gulp.src (config.appFiles.appSCSS)
    .pipe ($.sass (sassOpts))
    .pipe ($.autoprefixer (apOpts))
    .pipe ($.cleanCss ())
    .pipe ($.rename (config.destFiles.appCSS))
    .pipe (gulp.dest (config.destDirs.distStyles));
});

gulp.task ('compile:app:template-cache', function compileAppTemplateCache () {
  return gulp.src (config.appFiles.appHTML)
    .pipe ($.ngHtml2js ({
      moduleName: config.appData.appTemplateModule,
      prefix: config.appData.appTemplatePrefix
    }))
    .pipe ($.concat (config.appData.appTemplate))
    .pipe (gulp.dest (config.srcDirs.appGenerated));
});

gulp.task ('compile:app:devel:ieshims', function compileAppIEShims () {
  return browserify ({
    debug: true
  })
    .require (config.ieShims)
    .bundle ()
    .pipe (source ('.'))
    .pipe ($.rename (config.destFiles.ieShimsJS))
    .pipe (gulp.dest (config.destDirs.buildScripts));
});

gulp.task ('compile:app:prod:ieshims', function compileAppProdIEShims () {
  return browserify ({
  })
    .require (config.ieShims)
    .bundle ()
    .pipe (source ('.'))
    .pipe ($.rename (config.destFiles.ieShimsJS))
    .pipe (buffer ())
    .pipe ($.uglify ({
      preserveComments: $.uglifySaveLicense
    }))
    .pipe (gulp.dest (config.destDirs.distScripts));
});

gulp.task ('compile:app:devel:vendor', function compileAppDevelVendor () {
  var vendorPkgs = getNPMDependencies ();

  /* Remove the dependencies that we don't want to include, or that
   * are included elsewhere.
   */
  _.pullAll (vendorPkgs, config.vendorIgnore.concat (config.ieShims));

  return browserify ({
    debug: true
  })
    .require (vendorPkgs)
    .bundle ()
    .pipe (source ('.'))
    .pipe ($.rename (config.destFiles.vendorJS))
    .pipe (gulp.dest (config.destDirs.buildScripts));
});

gulp.task ('compile:app:prod:vendor', function compileAppProdVendor () {
  var vendorPkgs = getNPMDependencies ();

  /* Remove the dependencies that we don't want to include, or that
   * are included elsewhere.
   */
  _.pullAll (vendorPkgs, config.vendorIgnore.concat (config.ieShims));

  return browserify ({
  })
    .require (vendorPkgs)
    .bundle ()
    .pipe (source ('.'))
    .pipe ($.rename (config.destFiles.vendorJS))
    .pipe (buffer ())
    .pipe ($.uglify ({
      preserveComments: $.uglifySaveLicense
    }))
    .pipe (gulp.dest (config.destDirs.distScripts));
});

gulp.task ('compile:app:devel',
           gulp.series (gulp.parallel ('jshint:app',
                                       'jscs:app'),
                        'compile:app:template-cache',
                        gulp.parallel ('compile:app:devel:copystatic',
                                       'compile:app:devel:copyassets',
                                       function compileAppDevel () {
  return browserify ({
    debug: true,
    entries: config.appData.appMain,
    basedir: config.srcDirs.appScripts,
    paths: [config.srcDirs.appScripts, config.srcDirs.appGenerated]
  })
    .external (getNPMDependencies ())
    .plugin (sourcemapify, {
      root: config.srcDirs.appScripts
    })
    .bundle ()
    .pipe (source (config.appData.appMain))
    .pipe ($.rename (config.destFiles.appJS))
    .pipe (gulp.dest (config.destDirs.buildScripts));
})));

gulp.task ('compile:app:prod',
           gulp.series (gulp.parallel ('jshint:app',
                                       'jscs:app'),
                        'compile:app:template-cache',
                        gulp.parallel ('compile:app:prod:copystatic',
                                       'compile:app:prod:copyassets',
                                       function compileAppProd () {
  return browserify ({
    entries: config.appData.appMain,
    basedir: config.srcDirs.appScripts,
    paths: [config.srcDirs.appScripts, config.srcDirs.appGenerated]
  })
    .external (getNPMDependencies ())
    .bundle ()
    .pipe (source (config.appData.appMain))
    .pipe ($.rename (config.destFiles.appJS))
    .pipe (buffer ())
    .pipe ($.ngAnnotate ())
    .pipe ($.uglify ({
      preserveComments: $.uglifySaveLicense
    }))
    .pipe (gulp.dest (config.destDirs.distScripts));
})));

gulp.task ('compile:app:devel:all', gulp.series ('compile:app:devel:styles',
                                                 'compile:app:devel:ieshims',
                                                 'compile:app:devel:vendor',
                                                 'compile:app:devel'));

gulp.task ('compile:app:prod:all', gulp.series ('compile:app:prod:styles',
                                                'compile:app:prod:ieshims',
                                                'compile:app:prod:vendor',
                                                'compile:app:prod'));

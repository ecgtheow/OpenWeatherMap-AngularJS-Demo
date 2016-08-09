'use strict';

var fs = require ('fs');
var path = require ('path');
var basename = path.basename (module.filename);

var tasks = {};

fs
  .readdirSync (__dirname)
  .filter (function (dirent) {
    return (path.extname (dirent) === '.js') &&
      (dirent !== basename);
  })
  .forEach (function (dirent) {
    var taskname = path.basename (dirent, '.js');

    tasks[taskname] = require (path.join (__dirname, dirent));
  });

module.exports = tasks;

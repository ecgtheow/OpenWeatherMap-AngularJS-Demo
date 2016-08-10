'use strict';

var Results = function () {
  var self = this;

  self.resultsCount = function () {
    var results = element.all (by.repeater ('forecast in flc.retrieved'));

    return results.count ();
  };
};

module.exports = new Results ();

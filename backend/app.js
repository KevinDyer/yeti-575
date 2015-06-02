(function() {
  'use strict';

  var fs = require('fs');
  var path = require('path');

  var Promise = require('promise');

  var Analyzer = require('./lib/analyzer');

  var FILES_DIR = path.resolve('backend/files');

  var readdir = function(path) {
    return new Promise(function(fulfill, reject) {
      fs.readdir(path, function(error, files) {
        if (error) {
          reject(error);
        } else {
          fulfill(files);
        }
      });
    });
  };

  // Read all files from the files directory
  readdir(FILES_DIR)
  // TODO Analyze each data file
  .then(function(files) {
    for (var i = 0; i  < files.length; i++) {
      var file = files[i];
      var filePath = path.resolve(FILES_DIR, file);
      console.log(filePath);
      var analyzer = new Analyzer(filePath);
    }
  })
  .then(null, function(error) {
    console.log(error);
  });
  
}());
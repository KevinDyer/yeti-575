(function() {
  'use strict';

  function readdir(dirPath) {
    return new Promise(function(fulfill, reject) {
      fs.readdir(dirPath, function(err, files) {
        if (err) {
          reject(err);
        } else {
          fulfill(files);
        }
      });
    });
  }
  module.exports.readdir = readdir;

  function stat(filePath) {
    return new Promise(function(fulfill, reject) {
      fs.stat(filePath, function(err, stat) {
        if (err) {
          reject(err);
        } else {
          fulfill(stat);
        }
      });
    });
  }
  module.exports.stat = stat;
}());
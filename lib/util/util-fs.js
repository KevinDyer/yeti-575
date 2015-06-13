(function() {
  'use strict';

  var fs = require('fs');
  var Promise = require('promise');

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

  function readFile(filename, enc) {
    return new Promise(function(fulfill, reject) {
      fs.readFile(filename, enc, function(err, data) {
        if (err) {
          reject(err);
        } else {
          fulfill(data);
        }
      });
    });
  }
  module.exports.readFile = readFile;

  function readJSON(filename) {
    return readFile(filename, 'utf8').then(JSON.parse);
  }
  module.exports.readJSON = readJSON;

  function writeFile(filename, data, enc) {
    return new Promise(function(fulfill, reject) {
      fs.writeFile(filename, data, enc, function(err) {
        if (err) {
          reject(err);
        } else {
          fulfill();
        }
      });
    });
  }
  module.exports.writeFile = writeFile;

  function writeJSON(filename, data) {
    return writeFile(filename, JSON.stringify(data), 'utf8');
  }
  module.exports.writeJSON = writeJSON;
}());
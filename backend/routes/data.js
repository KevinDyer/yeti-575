(function() {
  'use strict';

  var fs = require('fs');
  var path = require('path');

  var Promise = require('promise');
  var sqlite3 = require('sqlite3');
  var express = require('express');
  var Router = express.Router;
  var Analyzer = require('../lib/analyzer');

  var DATA_FILES_DIR = path.resolve('backend/files');

  var router = Router();

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

  var openDataFile = function(filename) {
    return new Promise(function(fulfill, reject) {
      var db = new sqlite3.Database(filename, sqlite3.OPEN_READONLY, function(error) {
        if (error) {
          reject(error);
        } else {
          fulfill(db);
        }
      });
    });
  };

  var readAllRows = function(db, sql) {
    return new Promise(function(fulfill, reject) {
      db.all(sql, function(error, rows) {
        if (error) {
          reject(error);
        } else {
          fulfill(rows);
        }
      });
    });
  };

  var readRowsFromDataFile = function(filename) {
    return openDataFile(filename)
    .then(function(db) {
      return readAllRows(db, 'SELECT * FROM macTable');
    });
  };

  router.route('/')
  .get(function(request, response) {
    // Scan data files dir
    readdir(DATA_FILES_DIR)
    // Read each of the data files
    .then(function(files) {
      return Promise.all(files.map(function(file) {
        var filename = path.resolve(DATA_FILES_DIR, file);
        return readRowsFromDataFile(filename)
        .then(function(rows) {
          return Promise.resolve({
            filename: filename,
            rows: rows
          });
        });
      }));
    })
    // Run analyzer for each files
    .then(function(fileRows) {
      var data = [];

      for (var i = 0; i < fileRows.length; i++) {
        var filename = fileRows[i].filename;
        var analyzer = new Analyzer(fileRows[i].rows);
        data.push({
          filename: filename,
          data: analyzer.getData()
        });
      }

      // TODO return data
      response.json(data);
    })
    .then(null, function(error) {
      console.log(error);
      response.status(401).json(error);
    });
  });

  module.exports = router;
}());
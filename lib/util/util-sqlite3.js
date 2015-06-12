(function() {
  'use strict';

  var DBG = true;

  var sqlite3 = require('sqlite3');
  var Promise = require('promise');

  if (DBG) {
    sqlite3.verbose();
  }

  var openDatabase = function(filename) {
    return new Promise(function(fulfill, reject) {
      var database = new sqlite3.Database(filename, sqlite3.OPEN_READONLY, function(err) {
        if (err) {
          reject(err);
        } else {
          fulfill(database);
        }
      });
    });
  };
  module.exports.openDatabase = openDatabase;

  var all = function(database, sql) {
    return new Promise(function(fulfill, reject) {
      database.all(sql, function(err, rows) {
        if (err) {
          reject(err);
        } else {
          fulfill(rows);
        }
      });
    });
  };
  module.exports.all = all;

  var each = function(database, sql, callback) {
    return new Promise(function(fulfill, reject) {
      database.each(sql, callback, function(err, count) {
        if (err) {
          reject(err);
        } else {
          fulfill(count);
        }
      });
    });
  };
  module.exports.each = each;

  var closeDatabase = function(database) {
    return new Promise(function(fulfill, reject) {
      database.close(function(err) {
        if (err) {
          reject(err);
        } else {
          fulfill();
        }
      });
    });
  };
  module.exports.closeDatabase = closeDatabase;
}());
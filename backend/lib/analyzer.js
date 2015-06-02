(function() {
  'use strict';
/*
  var sqlite3 = require('sqlite3');
  var Promise = require('promise');

  var openDatabase = function(filename) {
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

  var eachDatabase = function(db, sql, callback) {
    return new Promise(function(fulfill, reject) {
      db.each(sql, function(error, row) {
        if (error) {
          reject(error);
        } else {
          callback(row);
        }
      }, function(error) {
        if (error) {
          reject(error);
        } else {
          fulfill(db);
        }
      });
    });
  };
*/
  var Analyzer = function(rows) {
    this._data = [];

    var indexes = {};
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var addr = row.addrHash;

      if (!indexes[addr]) {
        this._data.push({
          addrHash: row.addrHash,
          first: row.epoch,
          last: row.epoch,
          rawData: []
        });
        indexes[addr] = this._data.length;
      }
      var index = indexes[addr] - 1;

      var data = this._data[index];
      data.rawData.push(row);

      if (data.first > row.epoch) {
        data.first = row.epoch;
      }
      if(data.last < row.epoch) {
        data.last = row.epoch;
      }
    }
  };

  Analyzer.prototype.getData = function() {
    return this._data;
  };
  
  var Analyzer2 = function(filename) {
    var self = this;

    // Open the database
    openDatabase(filename)
    // Read all of the data from the mac address table
    .then(function(db) {
      var data = {};
  
      var sql = 'SELECT * FROM macTable';
      return eachDatabase(db, sql, function(row) {
        var addr = row.addrHash.toString('hex');
        if (!data[addr]) {
          data[addr] = {
            first: row.epoch,
            last: row.epoch,
            weak: row.snr,
            strong: row.snr,
            results: [{epoch: row.epoch, snr: row.snr}]
          };
        } else {
          if (data[addr].first > row.epoch) {
            data[addr].first = row.epoch;
          }
          if (data[addr].last < row.epoch) {
            data[addr].last = row.epoch;
          }
          if (data[addr].weak > row.snr) {
            data[addr].weak = row.snr;
          }
          if (data[addr].strong > row.snr) {
            data[addr].strong = row.snr;
          }
          data[addr].results.push({epoch: row.epoch, snr: row.snr});
        }
      })
      .then(function() {
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var d = data[key];

          console.log(key + ': ' + (d.last-d.first) + ' ' + d.weak + ' ' + d.strong + ' ' + d.results.length);
        }
        console.log(Object.keys(data).length);
      });
    });
  };

  module.exports = Analyzer;
}());
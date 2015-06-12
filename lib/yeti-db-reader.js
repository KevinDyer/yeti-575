(function() {
  'use strict';

  var SQL_QUERY = 'SELECT * FROM macTable';

  var UtilSqlite3 = require('./util/util-sqlite3');

  var YetiDbReader = function(filename) {
    this._filename = filename;
  };

  YetiDbReader.prototype.getData = function() {
    var self = this;

    self._data = {};

    return UtilSqlite3.openDatabase(self._filename)
    .then(function(database) {
      return UtilSqlite3.each(database, SQL_QUERY, function(err, row) {
        if (err) {
          console.log(err);
          return;
        }

        var addr = row.addrHash.toString('hex');
        if (!self._data[addr]) {
          self._data[addr] = {
            addr: addr,
            logs: []
          };
        }

        // Create log
        var log = {
          epoch: row.epoch,
          snr: row.snr
        };

        // Add log to the data
        self._data[addr].logs.push(log);
      });
    })
    .then(function() {
      return Promise.resolve(self._data);
    });
  };

  module.exports = YetiDbReader;
}());
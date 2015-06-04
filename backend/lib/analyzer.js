(function() {
  'use strict';

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

  module.exports = Analyzer;
}());
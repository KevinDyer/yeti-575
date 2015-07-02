(function() {
  'use strict';

  var SQL_QUERY = 'SELECT * FROM macTable';
  var TYPE = 'yeti-wifi-memory';

  var UtilSqlite3 = require('./../util/util-sqlite3');

  var mongoose = require('mongoose');
  var Promise = require('promise');

  var sId = 0;
  var locations = {};
  var identifiers = {};
  var events = [];

  var ParserYetiWifi = function(file) {
    this.file = file;
  };

  ParserYetiWifi.prototype.parse = function() {
    var self = this;

    var id = sId++;
    var location = locations[id] = {
      id: id,
      type: TYPE,
      name: self.file.originalname,
      info: {
        count: 0
      }
    };

    return UtilSqlite3.openDatabase(self.file.path)
    .then(function(database) {
      var marked = {};
      return UtilSqlite3.each(database, SQL_QUERY, function(err, row) {
        if (err) {
          console.log(err);
          return;
        }

        var addrHash = row.addrHash.toString('hex');
        if (!identifiers[addrHash]) {
          // Create identifier
          identifiers[addrHash] = {
            type: TYPE,
            info: {
              addrHash: addrHash,
              byLocation: {},
              first: row.epoch,
              last: row.epoch,
              strong: row.snr,
              weak: row.snr
            }
          };
        }
        var identifier = identifiers[addrHash];

        // Increase count each unique record per location
        if (!marked[identifier.info.addrHash]) {
          marked[identifier.info.addrHash] = true;
          location.info.count++;
        }

        // Update the overall stats for the identifier
        if (identifier.info.first > row.epoch) {
          identifier.info.first = row.epoch;
        }
        if (identifier.info.last < row.epoch) {
          identifier.info.last = row.epoch;
        }
        if (identifier.info.weak > row.snr) {
          identifier.info.weak = row.snr;
        }
        if (identifier.info.strong < row.snr) {
          identifier.info.strong = row.snr;
        }

        // Update the location stats for this identifier
        if (!identifier.info.byLocation[location.id]) {
          identifier.info.byLocation[location.id] = {
            first: row.epoch,
            last: row.epoch,
            strong: row.snr,
            weak: row.snr
          };
        }
        var locationStats = identifier.info.byLocation[location.id];
        if (locationStats.first > row.epoch) {
          locationStats.first = row.epoch;
        }
        if (locationStats.last < row.epoch) {
          locationStats.last = row.epoch;
        }
        if (locationStats.weak > row.snr) {
          locationStats.weak = row.snr;
        }
        if (locationStats.strong < row.snr) {
          locationStats.strong = row.snr;
        }

        var event = {
          type: TYPE,
          info: {
            snr: row.snr,
            errors: row.errors,
            extraInfo: row.extrainfo
          },
          location: location,
          identifier: identifier,
          timestamp: row.epoch
        };
        events.push(event);
      })
      .then(function() {
        return UtilSqlite3.closeDatabase(database);
      });
    });
  };

  ParserYetiWifi.prototype.getLocationList = function() {
    return Promise.resolve(Object.keys(locations).map(function(id) {
      var location = locations[id];
      return {
        id: location.id,
        type: location.type,
        name: location.name,
        info: location.info
      };
    }));
  };

  ParserYetiWifi.prototype.removeLocation = function(location) {
    var locationId = location.info.locationId;
    if (!locations[locationId]) {
      return Promise.reject(new Error('No location'));
    } else {
      delete locations[locationId];
      return Promise.resolve(location);
    }
  };

  module.exports = ParserYetiWifi;
}());
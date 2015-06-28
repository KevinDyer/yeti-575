(function() {
  'use strict';

  var SQL_QUERY = 'SELECT * FROM macTable';
  var TYPE = 'yeti-wifi-memory';

  var UtilSqlite3 = require('./../util/util-sqlite3');

  var mongoose = require('mongoose');
  var Promise = require('promise');

  var locations = {};
  var identifiers = {};
  var events = [];

  var ParserYetiWifi = function(file) {
    this.file = file;
  };

  ParserYetiWifi.prototype.parse = function() {
    var self = this;

    var originalName = self.file.originalname;
    var size = self.file.size;

    var locationId = originalName.toString() + size.toString();
    if (locations[locationId]) {
      return Promise.reject(new Error('Already Processed file'));
    }
    
    var location = locations[locationId] = {
      type: TYPE,
      info: {
        locationId: locationId,
        originalName: self.file.originalname,
        size: self.file.size,
        events: []
      }
    };

    return UtilSqlite3.openDatabase(self.file.path)
    .then(function(database) {
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
              first: row.epoch,
              last: row.epoch,
              strong: row.snr,
              weak: row.snr
            }
          };
        }
        var identifier = identifiers[addrHash];

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
        location.info.events.push(event);
      });
    });
  };

  ParserYetiWifi.prototype.getLocationList = function() {
    return Promise.resolve(Object.keys(locations).map(function(locationId) {
      var location = locations[locationId];
      return {
        type: location.type,
        info: {
          locationId: location.info.locationId,
          originalName: location.info.originalName,
          size: location.info.size
        }
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
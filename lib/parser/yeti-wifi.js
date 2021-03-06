(function() {
  'use strict';

  var SQL_QUERY = 'SELECT * FROM macTable';
  var TYPE = 'yeti-wifi';

  var UtilSqlite3 = require('./../util/util-sqlite3');

  var mongoose = require('mongoose');
  var Promise = require('promise');
  var Identifier = mongoose.model('Identifier');
  var Location = mongoose.model('Location');
  var Event = mongoose.model('Event');

  var ParserYetiWifi = function(file) {
    this.file = file;
  };

  ParserYetiWifi.prototype.parse = function() {
    var self = this;

    var location = new Location({
      type: TYPE,
      name: self.file.originalname,
      info: {
        count: 0
      }
    });

    return location.save()
    .then(function(location) {
      return UtilSqlite3.openDatabase(self.file.path);
    })
    .then(function(database) {
      var identifiers = {};
      var events = [];
      return UtilSqlite3.each(database, SQL_QUERY, function(err, row) {
        if (err) {
          console.log(err);
          return;
        }

        var addrHash = row.addrHash.toString('hex');
        if (!identifiers[addrHash]) {
          // Create identifier
          identifiers[addrHash] = new Identifier({
            type: TYPE,
            info: {
              addrHash: addrHash,
              first: row.epoch,
              last: row.epoch,
              strong: row.snr,
              weak: row.snr
            }
          });
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

        var event = new Event({
          type: TYPE,
          info: {
            snr: row.snr,
            errors: row.errors,
            extraInfo: row.extrainfo
          },
          location: location,
          identifier: identifier,
          timestamp: row.epoch
        });
        events.push(event);
      })
      .then(function() {
        return Promise.all(events.map(function(event) {
          return event.save();
        }));
      })
      .then(function() {
        var keys = Object.keys(identifiers);
        return Promise.all(keys.map(function(key) {
          var identifier = identifiers[key];
          return identifier.save();
        }));
      });
    });
  };

  ParserYetiWifi.prototype.getLocationList = function() {
    return Location.find()
    .then(function(locations) {
      return locations.map(function(location) {
        return {
          id: location.id,
          type: location.type,
          name: location.name,
          info: location.info
        };
      });
    });
  };

  ParserYetiWifi.prototype.removeLocation = function(id) {
    return Location.findByIdAndRemove(id);
  };

  module.exports = ParserYetiWifi;
}());
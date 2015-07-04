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
    })
    .then(function() {
      var orderedEvents = events.sort(function(a, b) {
        return b - a;
      });

      var visited = {};
      var visitedLocation = {};
      for (var i = 0; i < orderedEvents.length; i++) {
        var orderedEvent = orderedEvents[i];
        var location = orderedEvent.location;
        var identifier = orderedEvent.identifier;

        var locationId = location.id;
        // Check if this is a new location
        if (!visitedLocation[locationId]) {
          visitedLocation[locationId] = true;
          // Clear out stats
          locations[locationId].info.visits = {}
          locations[locationId].info.durations = [];
        }

        var identifierId = identifier.info.addrHash;
        // Check if this identifier has been visited before
        if (!visited[identifierId]) {
          // Assign it to the location it visited
          visited[identifierId] = {
            locationId: locationId,
            first: orderedEvent.timestamp,
            last: orderedEvent.timestamp
          };
        }

        // Check for same location
        var visitedLocationId = visited[identifierId].locationId;
        if (locationId !== visitedLocationId) {
          // Different locations...update location counter
          // Check for to location counter has been initialized
          if (!locations[visitedLocationId].info.visits[locationId]) {
            locations[visitedLocationId].info.visits[locationId] = {
              count: 0
            };
          }

          // Increment count from visited location to the new location
          locations[visitedLocationId].info.visits[locationId].count++;
          var duration = visited[identifierId].last - visited[identifierId].first;
          locations[visitedLocationId].info.durations.push(duration);
          // Update the visited location
          visited[identifierId] = {
            locationId: locationId,
            first: orderedEvent.timestamp,
            last: orderedEvent.timestamp
          };
        } else {
          // Since events are ordered by timesdtamp we can safely assume this
          // event happened after the previously saved event.
          visited[identifierId].last = orderedEvent.timestamp;
        }
      }
      Object.keys(visited).forEach(function(identifierId) {
        var visitedInfo = visited[identifierId];
        var duration = visitedInfo.last = visitedInfo.first;
        locations[visitedInfo.locationId].info.durations.push(duration);
      });
      Object.keys(locations).forEach(function(locId) {
        var loc = locations[locId];
        var shortest = Number.MAX_VALUE;
        var longest = Number.MIN_VALUE;
        var sum = 0;
        loc.info.durations.forEach(function(duration, index) {
          if (shortest > duration) {
            shortest = duration;
          }
          if (longest < duration) {
            longest = duration;
          }
          sum += duration;
        });
        loc.info.duration = {
          shortest: shortest,
          longest: longest,
          average: sum / loc.info.durations.length
        };
        delete loc.info.durations;
        console.log(loc.info);
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

  ParserYetiWifi.prototype.removeLocation = function(locationId) {
    if (!locations[locationId]) {
      return Promise.reject(new Error('No location'));
    } else {
      Object.keys(locations).forEach(function(locId) {
        var loc = locations[locId]
        delete loc.info.visits[locationId];
      });
      events.forEach(function(event, index) {
        if(locationId === event.location.id) {
          events.splice(index, 1);
        }
      });
      delete locations[locationId];
      console.log(locations);
      return Promise.resolve();
    }
  };

  module.exports = ParserYetiWifi;
}());
(function () {
  'use strict';

  var Promise = require('promise');
  var express = require('express');
  var ParserYetiWifi = require('./../lib/parser/yeti-wifi');
  var ParserYetiWifiMemory = require('./../lib/parser/yeti-wifi-memory');

  var Router = express.Router;

  var getParserFromType = function(type) {
    if ('yeti-wifi' === type) {
      return ParserYetiWifi;
    } else if ('yeti-wifi-memory' === type) {
      return ParserYetiWifiMemory;
    } else {
      return null;
    }
  };

  var router = new Router();
  router.route('/')
  .get(function(req, res) {
    var locs;
    var yetiWifi = new ParserYetiWifi();
    yetiWifi.getLocationList()
    .then(function(locations) {
      locs = locations;
      var yetiWifiMemory = new ParserYetiWifiMemory();
      return yetiWifiMemory.getLocationList();
    })
    .then(function(locations) {
      for(var i = 0; i < locations.length; i++) {
        locs.push(locations[i]);
      }
      res.status(200).json(locs);
    }, function(err) {
      res.json(err);
    });
  })
  .delete(function(req, res) {
    var type = req.query.type;
    var id = req.query.id;
    console.log(type, id);

    var Parser = getParserFromType(type);
    if (!Parser) {
      res.sendStatus(400);
    } else {
      var parser = new Parser();
      parser.removeLocation(id)
      .then(function(result) {
        res.status(204).json(result);
      }, function(err) {
        res.sendStatus(500);
      });
    }
  });

  module.exports = router;
}());
(function () {
  'use strict';

  var fs = require('fs');
  var path = require('path');

  var UPLOAD_DIR = path.resolve('./uploads');

  var Promise = require('promise');
  var express = require('express');
  var bodyParser = require('body-parser');
  var multer = require('multer');
  var mongoose = require('mongoose');
  var UtilFs = require('./../lib/util/util-fs');
  var ParserYetiWifi = require('./../lib/parser/yeti-wifi');
  var ParserYetiWifiMemory = require('./../lib/parser/yeti-wifi-memory');

  var Router = express.Router;
  var Location = mongoose.model('Location');

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
  .post(multer({dest: UPLOAD_DIR}), function(req, res) {
    var type = req.query.type;

    var Parser = getParserFromType(type);

    var promise = Promise.resolve();

    var fileFields = Object.keys(req.files);
    if (Parser) {
      promise = Promise.all(fileFields.map(function(fileField) {
        var file = req.files[fileField];
        var parser = new Parser(file);
        return parser.parse();
      }));
    } else {
      res.status(400);
      promise = Promise.reject(new Error('No parser'));
    }

    promise.then(function() {
      return Promise.all(fileFields.map(function(fieldname) {
        var file = req.files[fieldname];
        return UtilFs.unlink(file.path);
      }))
    }, function(err) {
      return Promise.all(fileFields.map(function(fieldname) {
        var file = req.files[fieldname];
        return UtilFs.unlink(file.path);
      }))
      .then(function() {
        return Promise.reject(err);
      })
    })
    .then(function() {
      res.sendStatus(201);
    }, function(err) {
      console.log(err);
      res.end();
    });
  })
  .delete(bodyParser.json(), function(req, res) {
    var location = JSON.parse(req.query.location);

    var Parser = getParserFromType(location.type);
    if (!Parser) {
      res.sendStatus(400);
    } else {
      var parser = new Parser();
      parser.removeLocation(location)
      .then(function(result) {
        res.status(204).json(result);
      }, function(err) {
        res.sendStatus(500);
      });
    }
  });

  module.exports = router;
}());
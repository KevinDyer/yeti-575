(function () {
  'use strict';

  var fs = require('fs');
  var path = require('path');

  var Promise = require('promise');
  var express = require('express');
  var multer = require('multer');
  var Router = express.Router;

  var router = new Router();

  function readdir(dirPath) {
    return new Promise(function(fulfill, reject) {
      fs.readdir(dirPath, function(err, files) {
        if (err) {
          reject(err);
        } else {
          fulfill(files);
        }
      });
    });
  }

  function stat(filePath) {
    return new Promise(function(fulfill, reject) {
      fs.stat(filePath, function(err, stat) {
        if (err) {
          reject(err);
        } else {
          fulfill(stat);
        }
      });
    });
  }

  router.route('/')
  .get(function(req, res) {
    var uploadDir = path.resolve('./uploads');

    readdir(uploadDir)
    .then(function(files) {
      return Promise.all(files.map(function(file) {
        var filePath = path.resolve(uploadDir, file);
        return stat(filePath);
      }))
      .then(function(stats) {
        var filteredFiles = [];
        for (var i = 0; i < files.length; i++) {
          if (stats[i].isFile()) {
            filteredFiles.push(stats[i]);
            filteredFiles[filteredFiles.length-1].filename = files[i];
          }
        }
        res.status(200).json(filteredFiles);
      });
    })
    .then(null, function(err) {
      res.status(401).json(err.toString());
    });
  })
  .post(multer({dest: './uploads/'}), function(req, res) {
    // Check if there is a display name
    var displayName = req.body.displayName;
    if (!displayName) {
      res.status(422).json('Display name missing.');
      return;
    }

    var filenames = Object.keys(req.files);
    for (var i = 0; i < filenames.length; i++) {
      var filename = filenames[i];
      files[filename] = req.files[filename];
      files[filename].timestamp = Date.now();
      files[filename].displayName = displayName;
    }
    res.sendStatus(204);
  });

  module.exports = router;
}());
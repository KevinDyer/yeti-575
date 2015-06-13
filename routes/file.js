(function () {
  'use strict';

  var fs = require('fs');
  var path = require('path');

  var UPLOAD_DIR = path.resolve('./uploads');

  var Promise = require('promise');
  var express = require('express');
  var multer = require('multer');
  var Router = express.Router;
  var YetiDbReader = require('./../lib/yeti-db-reader');

  var router = new Router();

  var sId = 0;
  var files = [];

  // TODO Read files from the upload directory and analyze them

  router.route('/')
  .get(function(req, res) {
    var filteredFiles = [];
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      filteredFiles.push({
        id: file.id,
        displayName: file.displayName,
        count: Object.keys(file.data).length
      });
    }
    res.status(200).json(filteredFiles);
  })
  .post(multer({dest: UPLOAD_DIR}), function(req, res) {
    var filenames = Object.keys(req.files);
    Promise.all(filenames.map(function(filename) {
      var filePath = req.files[filename].path;

      var yetiDbReader = new YetiDbReader(filePath);
      return yetiDbReader.getData()
      .then(function(data) {
        files.push({
          id: sId++,
          displayName: req.files[filename].originalname,
          data: data,
          timestamp: Date.now()
        });
        return Promise.resolve(files[files.length-1]);
      }, function(err) {
        console.log(err);
        return Promise.resolve();
      });
    }))
    .then(function(file) {
      res.status(204).json(file);
    }, function(err) {
      res.sendStatus(522);
    });
  });

  module.exports = router;
}());
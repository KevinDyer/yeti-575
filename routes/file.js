(function () {
  'use strict';

  var fs = require('fs');
  var path = require('path');

  var UPLOAD_DIR = path.resolve('./uploads');
  var FILE_LIST_FILENAME = path.resolve(UPLOAD_DIR, 'file-list.json');

  var Promise = require('promise');
  var express = require('express');
  var multer = require('multer');
  var Router = express.Router;
  var YetiDbReader = require('./../lib/yeti-db-reader');
  var UtilFs = require('./../lib/util/util-fs');

  var router = new Router();

  var sId = 0;
  var fileList = [];

  // TODO Read files from the upload directory and analyze them
  UtilFs.readJSON(FILE_LIST_FILENAME)
  .then(function(fileList) {
    return Promise.all(fileList.map(function(file) {
      return getAndAddDataFromFile(file)
      .then(null, function(err) {
        console.log(err);
      });
    }));
  })
  .then(function() {
    console.log('Finished loading previously uploaded files.');
  });

  var getAndAddDataFromFile = function(file) {
    var yetiDbReader = new YetiDbReader(file.path);
    return yetiDbReader.getData()
    .then(function(data) {
      fileList.push({
        id: sId++,
        name: file.name,
        originalname: file.originalname,
        path: file.path,
        data: data,
        timestamp: file.timestamp || Date.now()
      });
      return Promise.resolve(fileList[fileList.length-1]);
    });
  };

  router.route('/')
  .get(function(req, res) {
    var filteredFiles = fileList.map(function(file) {
      return {
        id: file.id,
        displayName: file.originalname,
        count: Object.keys(file.data).length
      };
    });
    res.status(200).json(filteredFiles);
  })
  .post(multer({dest: UPLOAD_DIR}), function(req, res) {
    var filenames = Object.keys(req.files);
    Promise.all(filenames.map(function(filename) {
      var file = req.files[filename];
      return getAndAddDataFromFile(file);
    }))
    .then(function() {
      return writeFileList();
    })
    .then(function() {
      var filteredFiles = fileList.map(function(file) {
        return {
          id: file.id,
          displayName: file.originalname,
          count: Object.keys(file.data).length
        };
      });
      res.status(204).json(filteredFiles);
    }, function(err) {
      res.status(422).json(err);
    });
  });

  var findFileIndexById = function(id) {
    for (var i = 0; i < fileList.length; i++) {
      var file = fileList[i];
      if (id === file.id) {
        return i;
      }
    }
    return -1;
  };

  var findFileById = function(id) {
    var index = findFileIndexById(id);
    if (0 > index) {
      return Promise.reject(new Error('No file with id ' + id));
    }
    var file = fileList[index];
    return Promise.resolve(file);
  };

  var removeFileFromFileList = function(file) {
    var index = findFileIndexById(file.id);
    if (0 > index) {
      return Promise.reject(new Error('No file with id ' + id));
    }
    fileList.splice(index, 1);
    return Promise.resolve();
  };

  var writeFileList = function() {
    return UtilFs.writeJSON(FILE_LIST_FILENAME, fileList.map(function(file) {
      return {
        name: file.name,
        originalname: file.originalname,
        path: file.path,
        timestamp: file.timestamp
      };
    }));
  };

  router.route('/:id')
  .delete(function(req, res) {
    var id = parseInt(req.params.id, 10);

    findFileById(id)
    .then(function(file) {
      return UtilFs.unlink(file.path)
      .then(function() {
        return removeFileFromFileList(file);
      });
    })
    .then(function() {
      return writeFileList();
    })
    .then(function() {
      res.sendStatus(204);
    }, function(err) {
      res.sendStatus(412);
    });
  });

  module.exports = router;
}());
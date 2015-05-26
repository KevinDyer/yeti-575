(function () {
  'use strict';

  var express = require('express');
  var busboy = require('connect-busboy');
  var router = express.Router();

  var dataFiles = [];

  // Add the data file uplaod route
  router.route('/files')
  .get(function(request, response) {
    response.json(dataFiles);
  })
  .post(busboy(), function(request, response) {
    var busboy = request.busboy;
    if (busboy) {
      busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        file.on('data', function(data) {
          //console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        });
        file.on('end', function() {
          console.log('File [' + fieldname + '] Finished');
        });
      });
      busboy.on('finish', function() {
        response.status(303).json(true);
      });
      request.pipe(busboy);
    }
  });

  module.exports = router;
}());
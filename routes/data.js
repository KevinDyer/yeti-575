(function () {
  'use strict';

  var fs = require('fs');
  var os = require('os');
  var path = require('path');

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
        var saveTo = path.join(os.tmpDir(), path.basename(filename));

        // Check if the file already exists in the data files
        if (dataFiles.indexOf(saveTo) >= 0) {
          response.status(400).json('File already exists');
          return;
        }

        file.pipe(fs.createWriteStream(saveTo));
        file.on('end', function() {
          console.log('File [' + filename + '] Finished');
          dataFiles.push(saveTo);
        });
      });
      busboy.on('finish', function() {
        //response.writeHead(200, { 'Connection': 'close' });
        response.sendStatus(200);
      });
      request.pipe(busboy);
    }
  });

  module.exports = router;
}());